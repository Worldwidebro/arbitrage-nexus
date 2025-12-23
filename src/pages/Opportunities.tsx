import { Layout } from "@/components/layout/Layout";
import { VERTICALS } from "@/lib/constants";
import { Link, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { orchestrator } from "@/integrations/orchestrator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

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
        query = query.eq('opportunity_type', activeVertical);
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
      const ventureId = await orchestrator.processOpportunity(opportunityId);
      if (ventureId) {
        alert(`✅ Venture created: ${ventureId}\n\nCheck GitHub: https://github.com/Worldwidebro/${ventureId}`);
        refetch();
      } else {
        alert('❌ Opportunity validation failed');
      }
    } catch (error) {
      console.error('Error processing opportunity:', error);
      alert('Error creating venture');
    } finally {
      setProcessing(null);
    }
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
                    <CardTitle className="text-xl">{opportunity.opportunity_type}</CardTitle>
                    <Badge variant={
                      opportunity.status === 'detected' ? 'default' :
                      opportunity.status === 'validated' ? 'secondary' :
                      opportunity.status === 'launched' ? 'success' : 'outline'
                    }>
                      {opportunity.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {opportunity.source_repo && `From: ${opportunity.source_repo}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Confidence:</span>
                      <span className="font-medium">
                        {((opportunity.confidence_score || 0) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Potential Revenue:</span>
                      <span className="font-medium">
                        ${(opportunity.potential_revenue || 0).toLocaleString()}/mo
                      </span>
                    </div>
                    {opportunity.template_id && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Template:</span>
                        <span className="font-medium">{opportunity.template_id}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleProcessOpportunity(opportunity.id)}
                    disabled={processing === opportunity.id || opportunity.status === 'launched'}
                    className="w-full"
                  >
                    {processing === opportunity.id ? 'Processing...' :
                     opportunity.status === 'launched' ? 'Already Launched' :
                     'Generate Venture'}
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
