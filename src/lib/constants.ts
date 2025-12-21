import { 
  Fuel, 
  Users, 
  Building2, 
  Diamond, 
  CreditCard, 
  Cog, 
  Factory 
} from "lucide-react";

export const VERTICALS = [
  {
    id: "oil",
    name: "Oil & Commodities",
    shortName: "Oil",
    description: "Connect Nigerian refineries with UK brokers. Facilitate $5M+ crude oil transactions with compliant documentation.",
    icon: Fuel,
    stats: {
      avgDealSize: "$5M - $50M",
      commission: "1-2%",
      timeToClose: "2-4 weeks",
    },
    color: "hsl(38 92% 50%)",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: "ai_teams",
    name: "AI Team Arbitrage",
    shortName: "AI Teams",
    description: "Build world-class AI teams at $4K that clients pay $35K for. 10x margin on talent arbitrage.",
    icon: Users,
    stats: {
      avgDealSize: "$35K/month",
      commission: "$31K margin",
      timeToClose: "1-2 weeks",
    },
    color: "hsl(270 70% 55%)",
    gradient: "from-purple-500 to-violet-600",
  },
  {
    id: "construction",
    name: "Construction Materials",
    shortName: "Construction",
    description: "Source steel, cement, copper from surplus markets to shortage zones. 15-30% margins on essential materials.",
    icon: Building2,
    stats: {
      avgDealSize: "$500K - $5M",
      commission: "15-30%",
      timeToClose: "1-3 weeks",
    },
    color: "hsl(165 80% 40%)",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "luxury",
    name: "Luxury Goods",
    shortName: "Luxury",
    description: "Pre-owned luxury watches, cars, and art. Connect collectors across markets with authentication.",
    icon: Diamond,
    stats: {
      avgDealSize: "$50K - $2M",
      commission: "5-15%",
      timeToClose: "1-4 weeks",
    },
    color: "hsl(340 82% 52%)",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    id: "debt",
    name: "Distressed Debt",
    shortName: "Debt",
    description: "Acquire non-performing loans at 20-40 cents on the dollar. Package and resell to specialized funds.",
    icon: CreditCard,
    stats: {
      avgDealSize: "$1M - $100M",
      commission: "10-25%",
      timeToClose: "4-8 weeks",
    },
    color: "hsl(217 91% 60%)",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: "equipment",
    name: "Industrial Equipment",
    shortName: "Equipment",
    description: "Surplus machinery from developed markets to emerging economies. Heavy equipment, manufacturing lines.",
    icon: Cog,
    stats: {
      avgDealSize: "$100K - $10M",
      commission: "10-20%",
      timeToClose: "2-6 weeks",
    },
    color: "hsl(200 80% 50%)",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    id: "factories",
    name: "Factory Arbitrage",
    shortName: "Factories",
    description: "Relocate manufacturing capacity from high-cost to low-cost regions. Complete production line transfers.",
    icon: Factory,
    stats: {
      avgDealSize: "$5M - $100M",
      commission: "3-8%",
      timeToClose: "3-12 months",
    },
    color: "hsl(142 72% 42%)",
    gradient: "from-green-500 to-emerald-600",
  },
] as const;

export const ROLES = [
  { id: "buyer", label: "Buyer", description: "Looking to purchase goods, services, or assets" },
  { id: "seller", label: "Seller", description: "Have inventory, capacity, or assets to sell" },
  { id: "broker", label: "Broker/Agent", description: "Connect buyers and sellers, earn commission" },
  { id: "investor", label: "Investor", description: "Provide capital for deals and transactions" },
] as const;

export const NAVIGATION = {
  main: [
    { label: "Home", href: "/" },
    { label: "Opportunities", href: "/opportunities" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "AI Assistant", href: "/assistant" },
  ],
  auth: [
    { label: "Login", href: "/auth" },
    { label: "Sign Up", href: "/auth?signup=true" },
  ],
} as const;
