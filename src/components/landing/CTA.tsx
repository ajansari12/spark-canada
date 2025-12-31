import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-warm mb-8 animate-float">
            <Sparkles className="w-8 h-8 text-white" />
          </div>

          {/* Heading */}
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ready to Discover Your{" "}
            <span className="text-gradient">Perfect Business Idea?</span>
          </h2>

          {/* Description */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join 2,500+ Canadian entrepreneurs who have found their path to 
            business success. Start your journey today — it's free!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="btn-gradient rounded-full px-10 py-7 text-lg gap-2 group"
              asChild
            >
              <Link to="/wizard">
                Start the Wizard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-full px-10 py-7 text-lg"
              asChild
            >
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>

          {/* Trust Note */}
          <p className="text-sm text-muted-foreground mt-8">
            ✨ No credit card required · ⏱️ Takes only 5 minutes · 🇨🇦 Made for Canadians
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;