import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sparkles, Clock, Target, Lightbulb, ArrowRight, Briefcase, Shield, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepWelcomeProps {
  onStart: () => void;
  isSideHustle: boolean;
  onSideHustleChange: (value: boolean) => void;
  prioritizeRecessionResistance: boolean;
  onRecessionResistanceChange: (value: boolean) => void;
  isNewcomer: boolean;
  onNewcomerChange: (value: boolean) => void;
}

const StepWelcome = ({
  onStart,
  isSideHustle,
  onSideHustleChange,
  prioritizeRecessionResistance,
  onRecessionResistanceChange,
  isNewcomer,
  onNewcomerChange,
}: StepWelcomeProps) => {
  const benefits = [
    {
      icon: Lightbulb,
      title: "Personalized Ideas",
      description: "AI-generated business ideas tailored to your unique profile",
    },
    {
      icon: Target,
      title: "Viability Scores",
      description: "Data-driven analysis of each opportunity's potential",
    },
    {
      icon: Clock,
      title: "Quick & Easy",
      description: "Complete in just 5 minutes to unlock your recommendations",
    },
  ];

  return (
    <div className="text-center max-w-2xl mx-auto px-4">
      {/* Icon */}
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-warm mb-8 animate-float">
        <Sparkles className="w-10 h-10 text-white" />
      </div>

      {/* Heading */}
      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
        Let's Find Your Perfect{" "}
        <span className="text-gradient">Business Idea</span>
      </h1>

      {/* Description */}
      <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
        Answer a few questions about your skills, interests, and goals.
        Our AI will generate personalized business recommendations for your Canadian province.
      </p>

      {/* Mode Selection Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8 max-w-xl mx-auto">
        {/* Side Hustle Mode */}
        <button
          onClick={() => onSideHustleChange(!isSideHustle)}
          className={cn(
            "p-4 rounded-xl border-2 transition-all text-left",
            isSideHustle
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50"
          )}
        >
          <Briefcase className={cn("w-6 h-6 mb-2", isSideHustle ? "text-primary" : "text-muted-foreground")} />
          <h3 className="font-semibold text-sm mb-1">Side Hustle</h3>
          <p className="text-xs text-muted-foreground">Keep your day job</p>
        </button>

        {/* Recession Resistance */}
        <button
          onClick={() => onRecessionResistanceChange(!prioritizeRecessionResistance)}
          className={cn(
            "p-4 rounded-xl border-2 transition-all text-left",
            prioritizeRecessionResistance
              ? "border-success bg-success/10"
              : "border-border hover:border-success/50"
          )}
        >
          <Shield className={cn("w-6 h-6 mb-2", prioritizeRecessionResistance ? "text-success" : "text-muted-foreground")} />
          <h3 className="font-semibold text-sm mb-1">Recession-Proof</h3>
          <p className="text-xs text-muted-foreground">Stable in downturns</p>
        </button>

        {/* Newcomer Mode */}
        <button
          onClick={() => onNewcomerChange(!isNewcomer)}
          className={cn(
            "p-4 rounded-xl border-2 transition-all text-left",
            isNewcomer
              ? "border-accent bg-accent/10"
              : "border-border hover:border-accent/50"
          )}
        >
          <Globe className={cn("w-6 h-6 mb-2", isNewcomer ? "text-accent" : "text-muted-foreground")} />
          <h3 className="font-semibold text-sm mb-1">New to Canada</h3>
          <p className="text-xs text-muted-foreground">No credentials needed</p>
        </button>
      </div>

      {/* Benefits */}
      <div className="grid sm:grid-cols-3 gap-6 mb-10">
        {benefits.map((benefit) => (
          <div key={benefit.title} className="text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <benefit.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
            <p className="text-sm text-muted-foreground">{benefit.description}</p>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <Button
        size="lg"
        onClick={onStart}
        className="btn-gradient rounded-full px-10 py-7 text-lg gap-2 group"
      >
        Start the Wizard
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>

      {/* Note */}
      <p className="text-sm text-muted-foreground mt-6">
        Takes about 5 minutes · Your answers are saved automatically
      </p>
    </div>
  );
};

export default StepWelcome;