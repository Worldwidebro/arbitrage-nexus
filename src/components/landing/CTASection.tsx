import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function CTASection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    
    const { error } = await supabase
      .from("waitlist")
      .insert({ email });

    setLoading(false);

    if (error) {
      if (error.code === "23505") {
        toast({
          title: "Already registered",
          description: "This email is already on our waitlist!",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to join waitlist. Please try again.",
        });
      }
      return;
    }

    setSubmitted(true);
    toast({
      title: "Welcome to the waitlist!",
      description: "We'll be in touch with exclusive opportunities.",
    });
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:60px_60px] opacity-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[128px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Find Your Next{" "}
            <span className="gradient-text">Arbitrage Opportunity</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of traders, brokers, and investors who use Arbitrage Nexus
            to discover high-margin deals across global markets.
          </p>

          {submitted ? (
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-success/10 text-success">
              <CheckCircle className="h-6 w-6" />
              <span className="text-lg font-medium">You're on the list! Check your email soon.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 px-4"
                required
              />
              <Button type="submit" size="lg" className="h-12" disabled={loading}>
                {loading ? "Joining..." : "Join Waitlist"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}

          <p className="text-sm text-muted-foreground mt-4">
            No spam. Unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </section>
  );
}
