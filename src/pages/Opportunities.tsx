import { Layout } from "@/components/layout/Layout";
import { VERTICALS } from "@/lib/constants";
import { Link, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";

export default function Opportunities() {
  const [searchParams] = useSearchParams();
  const activeVertical = searchParams.get("vertical");
  const [processing, setProcessing] = useState<string | null>(null);

  // Fetch opportunities from Supabase
  const { data: opportunities, isLoading, refetch } = useQuery({
    queryKey: ['opportunities', activeVertical],
    queryFn: async () => {
      let query = supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (activeVertical) {
        query = query.eq('vertical', activeVertical as any);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Handle opportunity processing
  const handleProcessOpportunity = async (opportunityId: string) => {
    setProcessing(opportunityId);
    try {
      const { error } = await supabase
        .from('opportunities')
        .update({ status: 'matched' })
        .eq('id', opportunityId);

      if (error) throw error;
      toast.success('Opportunity matched successfully!');
      refetch();
    } catch (error) {
      console.error('Error processing opportunity:', error);
      toast.error('Error processing opportunity');
    } finally {
      setProcessing(null);
    }
  };

  const getStatusVariant = (status: string | null): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'active': return 'default';
      case 'matched': return 'secondary';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getVerticalName = (verticalId: string) => {
    const vertical = VERTICALS.find(v => v.id === verticalId);
    return vertical?.shortName || verticalId;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Opportunities</h1>
        <p className="text-muted-foreground mb-8">
          Browse arbitrage opportunities across all verticals
        </p>

        {/* Vertical Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            to="/opportunities"
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              !activeVertical ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            )}
          >
            All
          </Link>
          {VERTICALS.map((v) => (
            <Link
              key={v.id}
              to={`/opportunities?vertical=${v.id}`}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                activeVertical === v.id ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
              )}
            >
              {v.shortName}
            </Link>
          ))}
        </div>

        {/* Opportunities Grid */}
        {isLoading ? (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-muted-foreground">Loading opportunities...</p>
          </div>
        ) : !opportunities || opportunities.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-muted-foreground">
              No opportunities yet. Be the first to post one!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opportunity) => (
              <Card key={opportunity.id} className="glass">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{opportunity.title}</CardTitle>
                    <Badge variant={getStatusVariant(opportunity.status)}>
                      {opportunity.status || 'pending'}
                    </Badge>
                  </div>
                  <CardDescription>
                    {getVerticalName(opportunity.vertical)}
                    {opportunity.location && ` • ${opportunity.location}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {opportunity.description}
                  </p>
                  <div className="space-y-2">
                    {opportunity.value_estimate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Estimated Value:</span>
                        <span className="font-medium">
                          {opportunity.currency || '$'}{opportunity.value_estimate.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {opportunity.urgency && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Urgency:</span>
                        <span className="font-medium capitalize">{opportunity.urgency}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleProcessOpportunity(opportunity.id)}
                    disabled={processing === opportunity.id || opportunity.status === 'completed'}
                    className="w-full"
                  >
                    {processing === opportunity.id ? 'Processing...' :
                     opportunity.status === 'completed' ? 'Completed' :
                     opportunity.status === 'matched' ? 'View Match' :
                     'Process Opportunity'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
