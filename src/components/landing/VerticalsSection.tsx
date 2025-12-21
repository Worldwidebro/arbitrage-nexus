import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { VERTICALS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function VerticalsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            7 High-Margin{" "}
            <span className="gradient-text">Arbitrage Verticals</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Each vertical represents a proven market inefficiency. Our AI identifies
            opportunities and connects you with verified counterparties.
          </p>
        </div>

        {/* Verticals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VERTICALS.map((vertical, index) => (
            <Link
              key={vertical.id}
              to={`/opportunities?vertical=${vertical.id}`}
              className={cn(
                "group vertical-card glass",
                "animate-fade-in-up"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div
                className={cn(
                  "h-14 w-14 rounded-2xl flex items-center justify-center mb-4",
                  `bg-gradient-to-br ${vertical.gradient}`
                )}
              >
                <vertical.icon className="h-7 w-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {vertical.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {vertical.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Deal Size</p>
                  <p className="text-sm font-medium">{vertical.stats.avgDealSize}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Commission</p>
                  <p className="text-sm font-medium text-primary">{vertical.stats.commission}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Timeline</p>
                  <p className="text-sm font-medium">{vertical.stats.timeToClose}</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span>View Opportunities</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
