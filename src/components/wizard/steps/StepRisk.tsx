import { WizardData } from "@/types/wizard";
import { Shield, TrendingUp, Clock, Target, Zap, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepRiskProps {
  riskTolerance: WizardData['riskTolerance'];
  experienceLevel: WizardData['experienceLevel'];
  timeline: WizardData['timeline'];
  onChange: (updates: Partial<Pick<WizardData, 'riskTolerance' | 'experienceLevel' | 'timeline'>>) => void;
}

const riskOptions = [
  {
    value: 'low' as const,
    icon: Shield,
    label: 'Conservative',
    description: 'Lower risk, steady returns',
    color: 'success',
  },
  {
    value: 'medium' as const,
    icon: TrendingUp,
    label: 'Balanced',
    description: 'Moderate risk and reward',
    color: 'warning',
  },
  {
    value: 'high' as const,
    icon: Zap,
    label: 'Aggressive',
    description: 'Higher risk, higher potential',
    color: 'primary',
  },
];

const experienceOptions = [
  {
    value: 'beginner' as const,
    icon: Leaf,
    label: 'First-time Entrepreneur',
    description: 'New to running a business',
  },
  {
    value: 'some-experience' as const,
    icon: Target,
    label: 'Some Experience',
    description: 'Had a side hustle or small venture',
  },
  {
    value: 'experienced' as const,
    icon: TrendingUp,
    label: 'Experienced',
    description: 'Run one or more businesses before',
  },
];

const timelineOptions = [
  { value: 'asap' as const, label: 'ASAP', description: 'Ready to start immediately' },
  { value: '3-6-months' as const, label: '3-6 months', description: 'Planning phase' },
  { value: '6-12-months' as const, label: '6-12 months', description: 'Long-term planning' },
  { value: '1-year-plus' as const, label: '1+ year', description: 'Future goal' },
];

const StepRisk = ({ riskTolerance, experienceLevel, timeline, onChange }: StepRiskProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Tell us about your risk profile
        </h2>
        <p className="text-muted-foreground">
          This helps us match you with suitable business opportunities
        </p>
      </div>

      {/* Risk Tolerance */}
      <div className="mb-8">
        <h3 className="font-semibold text-foreground mb-3">Risk Tolerance</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {riskOptions.map((option) => {
            const isSelected = riskTolerance === option.value;
            
            return (
              <button
                key={option.value}
                onClick={() => onChange({ riskTolerance: option.value })}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all text-center",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  isSelected
                    ? `bg-${option.color} text-${option.color}-foreground border-${option.color}`
                    : "bg-card border-border hover:border-primary/30"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3",
                  isSelected ? "bg-white/20" : `bg-${option.color}/10`
                )}>
                  <option.icon className={cn(
                    "w-6 h-6",
                    isSelected ? "" : `text-${option.color}`
                  )} />
                </div>
                <div className={cn(
                  "font-semibold mb-1",
                  isSelected ? "" : "text-foreground"
                )}>
                  {option.label}
                </div>
                <div className={cn(
                  "text-sm",
                  isSelected ? "opacity-90" : "text-muted-foreground"
                )}>
                  {option.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Experience Level */}
      <div className="mb-8">
        <h3 className="font-semibold text-foreground mb-3">Business Experience</h3>
        <div className="space-y-2">
          {experienceOptions.map((option) => {
            const isSelected = experienceLevel === option.value;
            
            return (
              <button
                key={option.value}
                onClick={() => onChange({ experienceLevel: option.value })}
                className={cn(
                  "w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4",
                  "hover:scale-[1.01] active:scale-[0.99]",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border hover:border-primary/30"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  isSelected ? "bg-white/20" : "bg-primary/10"
                )}>
                  <option.icon className={cn(
                    "w-5 h-5",
                    isSelected ? "" : "text-primary"
                  )} />
                </div>
                <div>
                  <div className={cn(
                    "font-semibold",
                    isSelected ? "" : "text-foreground"
                  )}>
                    {option.label}
                  </div>
                  <div className={cn(
                    "text-sm",
                    isSelected ? "opacity-90" : "text-muted-foreground"
                  )}>
                    {option.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          When do you want to launch?
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {timelineOptions.map((option) => {
            const isSelected = timeline === option.value;
            
            return (
              <button
                key={option.value}
                onClick={() => onChange({ timeline: option.value })}
                className={cn(
                  "p-3 rounded-lg border-2 transition-all text-center",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border hover:border-primary/30"
                )}
              >
                <div className={cn(
                  "font-semibold text-sm",
                  isSelected ? "" : "text-foreground"
                )}>
                  {option.label}
                </div>
                <div className={cn(
                  "text-xs",
                  isSelected ? "opacity-90" : "text-muted-foreground"
                )}>
                  {option.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-8 p-4 rounded-xl bg-muted/50 text-center">
        <p className="text-sm text-muted-foreground">
          Almost done! Click "Generate Ideas" to get your personalized business recommendations.
        </p>
      </div>
    </div>
  );
};

export default StepRisk;