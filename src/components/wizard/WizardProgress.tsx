import { Link } from "react-router-dom";
import { Sparkles, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  isSaving: boolean;
}

const stepLabels = [
  "Welcome",
  "Industries",
  "Skills",
  "Budget",
  "Time",
  "Location",
  "Risk Profile",
];

const WizardProgress = ({ currentStep, totalSteps, isSaving }: WizardProgressProps) => {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-warm flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-foreground hidden sm:inline">
              SPARK
            </span>
          </Link>

          {/* Progress Indicator */}
          <div className="flex-1 max-w-md mx-4 sm:mx-8">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-foreground">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {stepLabels[currentStep - 1]}
              </span>
              {isSaving && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Saving...
                </span>
              )}
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-warm rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Exit Button */}
          <Button variant="ghost" size="icon" asChild>
            <Link to="/app/dashboard">
              <X className="w-5 h-5" />
            </Link>
          </Button>
        </div>

        {/* Step Dots - Desktop */}
        <div className="hidden md:flex items-center justify-center gap-2 pb-4">
          {stepLabels.map((label, index) => {
            const stepNum = index + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <div key={label} className="flex items-center">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                    ${isCompleted ? 'bg-success text-success-foreground' : ''}
                    ${isCurrent ? 'bg-primary text-primary-foreground scale-110' : ''}
                    ${!isCompleted && !isCurrent ? 'bg-muted text-muted-foreground' : ''}
                  `}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
                </div>
                {index < stepLabels.length - 1 && (
                  <div
                    className={`w-8 h-0.5 mx-1 ${
                      isCompleted ? 'bg-success' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default WizardProgress;