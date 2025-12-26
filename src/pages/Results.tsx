import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UpgradeModal } from "@/components/subscription/UpgradeModal";
import { 
  Sparkles, 
  ArrowLeft, 
  Heart, 
  TrendingUp, 
  DollarSign,
  Target,
  Zap,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WizardData } from "@/types/wizard";

interface BusinessIdea {
  id?: string;
  name: string;
  description: string;
  industry: string;
  startup_cost_min: number;
  startup_cost_max: number;
  monthly_revenue_min: number;
  monthly_revenue_max: number;
  viability_score: number;
  market_fit_score: number;
  skills_match_score: number;
  quick_wins: string[];
  competitors: string[];
  grants: string[];
  is_saved?: boolean;
}

const Results = () => {
  const { user, loading: authLoading } = useAuth();
  const { tier, subscribed } = useSubscription();
  const { usage, incrementUsage, FREE_GENERATION_LIMIT } = useUsageLimits();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const sessionId = searchParams.get("session");
  
  const [ideas, setIdeas] = useState<BusinessIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<BusinessIdea | null>(null);
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user && sessionId && !hasGenerated) {
      generateIdeas();
    }
  }, [user, authLoading, sessionId]);

  const generateIdeas = async () => {
    if (!sessionId || !user) return;

    // Check if user can generate (unless they're subscribed)
    if (!subscribed && !usage.canGenerate) {
      setShowUpgradeModal(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsGenerating(true);

    try {
      // Fetch session data
      const { data: session, error: sessionError } = await supabase
        .from("sessions")
        .select("wizard_data")
        .eq("id", sessionId)
        .single();

      if (sessionError) throw sessionError;

      const wizardData = session.wizard_data as unknown as WizardData;

      // Call the edge function
      const { data, error } = await supabase.functions.invoke("generate-ideas", {
        body: { wizardData, sessionId },
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || "Failed to generate ideas");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setIdeas(data.ideas || []);
      setHasGenerated(true);

      // Increment usage count for free users
      if (!subscribed) {
        await incrementUsage();
      }
      
      toast({
        title: "Ideas Generated!",
        description: `We found ${data.ideas?.length || 0} business ideas for you.${!subscribed ? ` (${usage.remaining - 1} generations left this month)` : ""}`,
      });

    } catch (error) {
      console.error("Error generating ideas:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate ideas. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    if (!subscribed && !usage.canGenerate) {
      setShowUpgradeModal(true);
      return;
    }
    setHasGenerated(false);
    generateIdeas();
  };

  const saveIdea = async (idea: BusinessIdea, index: number) => {
    if (!user) return;

    const tempId = `temp-${index}`;
    setSavingIds((prev) => new Set(prev).add(tempId));

    try {
      const { data, error } = await supabase
        .from("ideas")
        .insert([{
          user_id: user.id,
          session_id: sessionId,
          name: idea.name,
          description: idea.description,
          industry: idea.industry,
          startup_cost_min: idea.startup_cost_min,
          startup_cost_max: idea.startup_cost_max,
          monthly_revenue_min: idea.monthly_revenue_min,
          monthly_revenue_max: idea.monthly_revenue_max,
          viability_score: idea.viability_score,
          market_fit_score: idea.market_fit_score,
          skills_match_score: idea.skills_match_score,
          quick_wins: idea.quick_wins,
          competitors: idea.competitors,
          grants: idea.grants,
          is_saved: true,
        }])
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setIdeas((prev) =>
        prev.map((i, idx) => (idx === index ? { ...i, id: data.id, is_saved: true } : i))
      );

      toast({
        title: "Idea Saved!",
        description: `"${idea.name}" has been saved to your ideas.`,
      });
    } catch (error) {
      console.error("Error saving idea:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Failed to save idea. Please try again.",
      });
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.delete(tempId);
        return next;
      });
    }
  };

  const formatCurrency = (value: number): string => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-muted-foreground";
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-warm flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            {isGenerating ? "Generating Your Ideas..." : "Loading..."}
          </h2>
          {isGenerating && (
            <p className="text-muted-foreground">
              Our AI is analyzing your profile and finding the perfect business opportunities for you.
            </p>
          )}
          <div className="mt-6 flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-primary animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/app/dashboard">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-warm flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-display font-bold text-lg text-foreground">
                  Your Business Ideas
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!subscribed && (
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {usage.remaining} generations left
                </span>
              )}
              <Button
                variant="outline"
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="gap-2"
              >
                <RefreshCw className={cn("w-4 h-4", isGenerating && "animate-spin")} />
                Regenerate
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {ideas.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No ideas generated yet.</p>
            <Button onClick={generateIdeas} className="btn-gradient">
              Generate Ideas
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Ideas List */}
            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                {ideas.length} Ideas Generated
              </h2>
              
              {ideas.map((idea, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIdea(idea)}
                  className={cn(
                    "w-full text-left p-5 rounded-xl border-2 transition-all",
                    selectedIdea === idea
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/30"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {idea.industry}
                        </span>
                        {idea.is_saved && (
                          <BookmarkCheck className="w-4 h-4 text-success" />
                        )}
                      </div>
                      <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                        {idea.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {idea.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className={cn("font-display text-2xl font-bold", getScoreColor(idea.viability_score))}>
                        {idea.viability_score}
                      </div>
                      <div className="text-xs text-muted-foreground">Viability</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="w-4 h-4" />
                      <span>{formatCurrency(idea.startup_cost_min)} - {formatCurrency(idea.startup_cost_max)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <TrendingUp className="w-4 h-4" />
                      <span>{formatCurrency(idea.monthly_revenue_min)}/mo</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Idea Details */}
            <div className="lg:sticky lg:top-24 lg:h-fit">
              {selectedIdea ? (
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {selectedIdea.industry}
                      </span>
                      <h2 className="font-display text-2xl font-bold text-foreground mt-3">
                        {selectedIdea.name}
                      </h2>
                    </div>
                    <Button
                      variant={selectedIdea.is_saved ? "secondary" : "default"}
                      size="sm"
                      onClick={() => !selectedIdea.is_saved && saveIdea(selectedIdea, ideas.indexOf(selectedIdea))}
                      disabled={selectedIdea.is_saved || savingIds.size > 0}
                      className="gap-2"
                    >
                      {selectedIdea.is_saved ? (
                        <>
                          <BookmarkCheck className="w-4 h-4" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-4 h-4" />
                          Save Idea
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-muted-foreground mb-6">{selectedIdea.description}</p>

                  {/* Scores */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className={cn("font-display text-2xl font-bold", getScoreColor(selectedIdea.viability_score))}>
                        {selectedIdea.viability_score}
                      </div>
                      <div className="text-xs text-muted-foreground">Viability</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className={cn("font-display text-2xl font-bold", getScoreColor(selectedIdea.market_fit_score))}>
                        {selectedIdea.market_fit_score}
                      </div>
                      <div className="text-xs text-muted-foreground">Market Fit</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className={cn("font-display text-2xl font-bold", getScoreColor(selectedIdea.skills_match_score))}>
                        {selectedIdea.skills_match_score}
                      </div>
                      <div className="text-xs text-muted-foreground">Skills Match</div>
                    </div>
                  </div>

                  {/* Financials */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm">Startup Cost</span>
                      </div>
                      <div className="font-display font-bold text-foreground">
                        {formatCurrency(selectedIdea.startup_cost_min)} - {formatCurrency(selectedIdea.startup_cost_max)}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">Monthly Revenue</span>
                      </div>
                      <div className="font-display font-bold text-success">
                        {formatCurrency(selectedIdea.monthly_revenue_min)} - {formatCurrency(selectedIdea.monthly_revenue_max)}
                      </div>
                    </div>
                  </div>

                  {/* Quick Wins */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-warning" />
                      Quick Wins (First 30 Days)
                    </h3>
                    <ul className="space-y-2">
                      {selectedIdea.quick_wins?.map((win, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          {win}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Grants */}
                  {selectedIdea.grants && selectedIdea.grants.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-accent" />
                        Relevant Grants & Funding
                      </h3>
                      <ul className="space-y-2">
                        {selectedIdea.grants.map((grant, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <ChevronRight className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                            {grant}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Competitors */}
                  {selectedIdea.competitors && selectedIdea.competitors.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Key Competitors</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedIdea.competitors.map((comp, idx) => (
                          <span key={idx} className="px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground">
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-muted/30 rounded-2xl border border-dashed border-border p-12 text-center">
                  <Sparkles className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select an idea to see details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button className="btn-gradient rounded-full px-8" asChild>
            <Link to="/app/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </main>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="Idea Generation"
      />
    </div>
  );
};

export default Results;