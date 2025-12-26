import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, TrendingUp, MapPin, Lightbulb } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Business Ideas for Canadians</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-in-up">
              Discover Your Perfect{" "}
              <span className="text-gradient">Canadian Business</span>{" "}
              Idea
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 animate-fade-in-up animation-delay-100">
              Answer a few questions about your skills, budget, and goals. 
              Our AI generates personalized, validated business ideas tailored 
              to your Canadian province.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up animation-delay-200">
              <Button 
                size="lg" 
                className="btn-gradient rounded-full px-8 py-6 text-lg gap-2 group"
                asChild
              >
                <Link to="/wizard">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full px-8 py-6 text-lg"
                asChild
              >
                <a href="#how-it-works">See How It Works</a>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 mt-10 justify-center lg:justify-start animate-fade-in-up animation-delay-300">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-background flex items-center justify-center text-xs font-medium"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground">2,500+ Ideas Generated</div>
                <div className="text-sm text-muted-foreground">Join Canadian entrepreneurs</div>
              </div>
            </div>
          </div>

          {/* Right Content - Floating Cards */}
          <div className="relative hidden lg:block">
            <div className="relative w-full h-[500px]">
              {/* Main Card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-card rounded-2xl shadow-xl border border-border p-6 animate-float">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">Artisan Coffee Roastery</h3>
                    <p className="text-sm text-muted-foreground">Vancouver, BC</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Viability Score</span>
                    <span className="font-semibold text-success">87/100</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: "87%" }} />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Startup Cost</span>
                    <span className="font-semibold">$25K - $40K</span>
                  </div>
                </div>
              </div>

              {/* Floating Card - Top Right */}
              <div className="absolute top-8 right-0 w-48 bg-card rounded-xl shadow-lg border border-border p-4 animate-float animation-delay-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">Trending</div>
                    <div className="text-xs text-muted-foreground">Tech Sector +24%</div>
                  </div>
                </div>
              </div>

              {/* Floating Card - Bottom Left */}
              <div className="absolute bottom-12 left-0 w-52 bg-card rounded-xl shadow-lg border border-border p-4 animate-float animation-delay-400">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">Province Match</div>
                    <div className="text-xs text-muted-foreground">Ontario opportunities</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full animate-pulse-soft" />
        </div>
      </div>
    </section>
  );
};

export default Hero;