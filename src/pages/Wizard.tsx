import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { WizardData, defaultWizardData } from "@/types/wizard";
import WizardProgress from "@/components/wizard/WizardProgress";
import WizardNavigation from "@/components/wizard/WizardNavigation";
import StepWelcome from "@/components/wizard/steps/StepWelcome";
import StepIndustries from "@/components/wizard/steps/StepIndustries";
import StepSkills from "@/components/wizard/steps/StepSkills";
import StepBudget from "@/components/wizard/steps/StepBudget";
import StepTime from "@/components/wizard/steps/StepTime";
import StepLocation from "@/components/wizard/steps/StepLocation";
import StepRisk from "@/components/wizard/steps/StepRisk";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TOTAL_STEPS = 7;

const Wizard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>(defaultWizardData);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load or create session
  useEffect(() => {
    if (user) {
      loadOrCreateSession();
    }
  }, [user]);

  const loadOrCreateSession = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Check for existing in-progress session
      const { data: existingSession, error: fetchError } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'in_progress')
        .order('created_at', { ascending: false })
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingSession) {
        setSessionId(existingSession.id);
        setCurrentStep(existingSession.current_step);
        const savedData = existingSession.wizard_data as unknown as WizardData;
        if (savedData) {
          setWizardData({ ...defaultWizardData, ...savedData });
        }
      } else {
        // Create new session
        const { data: newSession, error: createError } = await supabase
          .from('sessions')
          .insert([{
            user_id: user.id,
            status: 'in_progress',
            current_step: 1,
            wizard_data: JSON.parse(JSON.stringify(defaultWizardData)),
          }])
          .select()
          .single();

        if (createError) throw createError;
        setSessionId(newSession.id);
      }
    } catch (error) {
      console.error('Session error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your session. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save progress when data changes
  const saveProgress = async (step: number, data: WizardData) => {
    if (!sessionId || !user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('sessions')
        .update({
          current_step: step,
          wizard_data: JSON.parse(JSON.stringify(data)),
        })
        .eq('id', sessionId);

      if (error) throw error;
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateWizardData = (updates: Partial<WizardData>) => {
    const newData = { ...wizardData, ...updates };
    setWizardData(newData);
  };

  const handleNext = async () => {
    if (currentStep < TOTAL_STEPS) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      await saveProgress(nextStep, wizardData);
    } else {
      // Complete wizard
      await completeWizard();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeWizard = async () => {
    if (!sessionId || !user) return;

    setIsLoading(true);
    try {
      await supabase
        .from('sessions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          wizard_data: JSON.parse(JSON.stringify(wizardData)),
        })
        .eq('id', sessionId);

      toast({
        title: "Wizard Complete!",
        description: "Generating your personalized business ideas...",
      });

      navigate(`/results?session=${sessionId}`);
    } catch (error) {
      console.error('Complete error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete the wizard. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1: return true; // Welcome step
      case 2: return wizardData.industries.length >= 1;
      case 3: return wizardData.skills.length >= 3;
      case 4: return wizardData.budgetMin > 0;
      case 5: return !!wizardData.timeCommitment;
      case 6: return !!wizardData.province;
      case 7: return !!wizardData.riskTolerance;
      default: return false;
    }
  };

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-warm flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-muted-foreground">Loading your wizard...</p>
        </div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    navigate("/auth");
    return null;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepWelcome onStart={handleNext} />;
      case 2:
        return (
          <StepIndustries
            selected={wizardData.industries}
            onChange={(industries) => updateWizardData({ industries })}
          />
        );
      case 3:
        return (
          <StepSkills
            skills={wizardData.skills}
            onChange={(skills) => updateWizardData({ skills })}
          />
        );
      case 4:
        return (
          <StepBudget
            min={wizardData.budgetMin}
            max={wizardData.budgetMax}
            onChange={(budgetMin, budgetMax) => updateWizardData({ budgetMin, budgetMax })}
          />
        );
      case 5:
        return (
          <StepTime
            commitment={wizardData.timeCommitment}
            hours={wizardData.hoursPerWeek}
            onChange={(timeCommitment, hoursPerWeek) => updateWizardData({ timeCommitment, hoursPerWeek })}
          />
        );
      case 6:
        return (
          <StepLocation
            province={wizardData.province}
            city={wizardData.city}
            onChange={(province, city) => updateWizardData({ province, city })}
          />
        );
      case 7:
        return (
          <StepRisk
            riskTolerance={wizardData.riskTolerance}
            experienceLevel={wizardData.experienceLevel}
            timeline={wizardData.timeline}
            onChange={(updates) => updateWizardData(updates)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with Progress */}
      {currentStep > 1 && (
        <WizardProgress 
          currentStep={currentStep} 
          totalSteps={TOTAL_STEPS} 
          isSaving={isSaving}
        />
      )}

      {/* Step Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl animate-fade-in">
          {renderStep()}
        </div>
      </main>

      {/* Navigation */}
      {currentStep > 1 && (
        <WizardNavigation
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          canProceed={canProceed()}
          isLoading={isLoading}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}
    </div>
  );
};

export default Wizard;