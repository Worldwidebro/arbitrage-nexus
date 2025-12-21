import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}!
        </h1>
        <p className="text-muted-foreground mb-8">Your arbitrage command center</p>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold mb-2">Active Opportunities</h3>
            <p className="text-3xl font-bold text-primary">0</p>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold mb-2">Messages</h3>
            <p className="text-3xl font-bold text-primary">0</p>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold mb-2">Deals Closed</h3>
            <p className="text-3xl font-bold text-primary">0</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
