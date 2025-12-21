import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">A</span>
              </div>
              <span className="font-bold text-xl">Arbitrage Nexus</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Global arbitrage opportunities powered by AI. Connect, trade, and profit across 7 verticals.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/opportunities" className="hover:text-foreground transition-colors">Opportunities</Link></li>
              <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
              <li><Link to="/assistant" className="hover:text-foreground transition-colors">AI Assistant</Link></li>
              <li><Link to="/auth" className="hover:text-foreground transition-colors">Get Started</Link></li>
            </ul>
          </div>

          {/* Verticals */}
          <div>
            <h4 className="font-semibold mb-4">Verticals</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/opportunities?vertical=oil" className="hover:text-foreground transition-colors">Oil & Commodities</Link></li>
              <li><Link to="/opportunities?vertical=ai_teams" className="hover:text-foreground transition-colors">AI Team Arbitrage</Link></li>
              <li><Link to="/opportunities?vertical=construction" className="hover:text-foreground transition-colors">Construction Materials</Link></li>
              <li><Link to="/opportunities?vertical=luxury" className="hover:text-foreground transition-colors">Luxury Goods</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                <Twitter className="h-5 w-5 text-muted-foreground" />
              </a>
              <a href="#" className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                <Linkedin className="h-5 w-5 text-muted-foreground" />
              </a>
              <a href="#" className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                <Github className="h-5 w-5 text-muted-foreground" />
              </a>
              <a href="mailto:hello@arbitragenexus.ai" className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Arbitrage Nexus. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
