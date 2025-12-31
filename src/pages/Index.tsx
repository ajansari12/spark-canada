import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import { SuccessStoriesSection } from "@/components/landing/SuccessStoriesSection";
import PricingPreview from "@/components/landing/PricingPreview";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <SuccessStoriesSection />
        <PricingPreview />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;