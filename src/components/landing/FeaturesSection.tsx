import { Bot, Shield, Zap, Users, BarChart3, Globe } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI-Powered Discovery",
    description: "Our agents continuously scan markets, validate opportunities, and match you with the right deals.",
  },
  {
    icon: Shield,
    title: "Verified Counterparties",
    description: "Every buyer, seller, and broker is vetted. Trade with confidence knowing your partners are legitimate.",
  },
  {
    icon: Zap,
    title: "Real-Time Matching",
    description: "Get instant notifications when opportunities match your criteria. Never miss a profitable deal.",
  },
  {
    icon: Users,
    title: "Multi-Role Support",
    description: "Whether you're buying, selling, or brokering, our platform adapts to your role in each transaction.",
  },
  {
    icon: BarChart3,
    title: "Deal Analytics",
    description: "Track your portfolio, measure ROI, and get AI insights to improve your arbitrage strategy.",
  },
  {
    icon: Globe,
    title: "Global Network",
    description: "Access opportunities across continents. Our network spans from Lagos to London, Mumbai to Miami.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Why Choose{" "}
            <span className="gradient-text-accent">Arbitrage Nexus</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for serious arbitrageurs who need speed, security, and scale.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-glow transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
