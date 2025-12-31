import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  isLoading: boolean;
  onBack: () => void;
  onNext: () => void;
}

const WizardNavigation = ({
  currentStep,
  totalSteps,
  canProceed,
  isLoading,
  onBack,
  onNext,
}: WizardNavigationProps) => {
  const isLastStep = currentStep === totalSteps;

  return (
    <footer className="sticky bottom-0 z-50 bg-background/95 backdrop-blur border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={currentStep <= 1}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <Button
            onClick={onNext}
            disabled={!canProceed || isLoading}
            className={`gap-2 ${isLastStep ? 'btn-gradient px-8' : ''}`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : isLastStep ? (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Ideas
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default WizardNavigation;