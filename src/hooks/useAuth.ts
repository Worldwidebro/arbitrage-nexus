import { useState, useEffect, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  company_name: string | null;
  industry: string | null;
  location: string | null;
  bio: string | null;
  avatar_url: string | null;
}

interface UserRole {
  id: string;
  user_id: string;
  role: "buyer" | "seller" | "broker" | "investor" | "admin";
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!error && data) {
      setProfile(data);
    }
  }, []);

  const fetchRoles = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", userId);

    if (!error && data) {
      setRoles(data as UserRole[]);
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
            fetchRoles(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setRoles([]);
        }
        
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchRoles(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile, fetchRoles]);

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message,
      });
      return { error };
    }

    toast({
      title: "Account created",
      description: "Welcome to Arbitrage Nexus!",
    });

    return { data, error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message,
      });
      return { error };
    }

    toast({
      title: "Welcome back!",
      description: "You have been signed in successfully.",
    });

    return { data, error: null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message,
      });
      return { error };
    }

    setUser(null);
    setSession(null);
    setProfile(null);
    setRoles([]);

    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });

    return { error: null };
  };

  const setUserRole = async (role: "buyer" | "seller" | "broker" | "investor") => {
    if (!user) return { error: new Error("No user logged in") };

    const { error } = await supabase
      .from("user_roles")
      .upsert({
        user_id: user.id,
        role,
      }, {
        onConflict: "user_id,role",
      });

    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to set role",
        description: error.message,
      });
      return { error };
    }

    await fetchRoles(user.id);
    
    toast({
      title: "Role updated",
      description: `You are now registered as a ${role}.`,
    });

    return { error: null };
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error("No user logged in") };

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", user.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to update profile",
        description: error.message,
      });
      return { error };
    }

    await fetchProfile(user.id);
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });

    return { error: null };
  };

  const isAdmin = roles.some((r) => r.role === "admin");
  const primaryRole = roles[0]?.role;

  return {
    user,
    session,
    profile,
    roles,
    primaryRole,
    isAdmin,
    loading,
    signUp,
    signIn,
    signOut,
    setUserRole,
    updateProfile,
    refreshProfile: () => user && fetchProfile(user.id),
    refreshRoles: () => user && fetchRoles(user.id),
  };
}
