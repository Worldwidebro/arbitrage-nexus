import { Layout } from "@/components/layout/Layout";

export default function Assistant() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">AI Assistant</h1>
        <p className="text-muted-foreground mb-8">Get help finding arbitrage opportunities</p>
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-muted-foreground">AI Assistant coming soon!</p>
        </div>
      </div>
    </Layout>
  );
}
