import { Link } from "react-router-dom";
import { ArrowRight, Play, TrendingUp, Globe, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden hero-gradient">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:60px_60px] opacity-20" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-[128px] animate-pulse-slow" />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in-down">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm text-foreground/80">Now live: AI-Powered Global Arbitrage</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up text-foreground" style={{ animationDelay: "0.1s" }}>
            Find Global{" "}
            <span className="gradient-text">Arbitrage</span>
            <br />
            Opportunities with AI
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Connect buyers, sellers, and brokers across 7 high-margin verticals. 
            Our AI agents find, validate, and facilitate deals worth $5M to $100M+.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Button size="lg" className="h-14 px-8 text-lg" asChild>
              <Link to="/auth?signup=true">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg" asChild>
              <Link to="/opportunities">
                <Play className="mr-2 h-5 w-5" />
                View Opportunities
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="glass rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-center gap-2 text-primary mb-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-2xl sm:text-3xl font-bold">7</span>
              </div>
              <p className="text-sm text-muted-foreground">Verticals</p>
            </div>
            <div className="glass rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-center gap-2 text-primary mb-2">
                <Globe className="h-5 w-5" />
                <span className="text-2xl sm:text-3xl font-bold">$50M+</span>
              </div>
              <p className="text-sm text-muted-foreground">Deal Flow</p>
            </div>
            <div className="glass rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-center gap-2 text-primary mb-2">
                <Zap className="h-5 w-5" />
                <span className="text-2xl sm:text-3xl font-bold">AI</span>
              </div>
              <p className="text-sm text-muted-foreground">Powered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
