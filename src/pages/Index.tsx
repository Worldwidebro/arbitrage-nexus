import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/landing/HeroSection";
import { VerticalsSection } from "@/components/landing/VerticalsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CTASection } from "@/components/landing/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <VerticalsSection />
      <FeaturesSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
