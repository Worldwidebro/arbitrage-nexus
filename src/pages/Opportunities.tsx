import { Layout } from "@/components/layout/Layout";
import { VERTICALS } from "@/lib/constants";
import { Link, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Opportunities() {
  const [searchParams] = useSearchParams();
  const activeVertical = searchParams.get("vertical");

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Opportunities</h1>
        <p className="text-muted-foreground mb-8">Browse arbitrage opportunities across all verticals</p>

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

        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-muted-foreground">No opportunities yet. Be the first to post one!</p>
        </div>
      </div>
    </Layout>
  );
}
