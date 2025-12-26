import { BusinessIdea } from "@/types/idea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DollarSign, TrendingUp, Target, Zap, ChevronRight } from "lucide-react";

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideas: BusinessIdea[];
}

export const CompareModal = ({ isOpen, onClose, ideas }: CompareModalProps) => {
  const formatCurrency = (value: number | null): string => {
    if (value === null) return "N/A";
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  const getScoreColor = (score: number | null): string => {
    if (score === null) return "text-muted-foreground";
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-muted-foreground";
  };

  const getHighestScore = (key: keyof BusinessIdea) => {
    const scores = ideas.map((i) => (i[key] as number) ?? 0);
    return Math.max(...scores);
  };

  const isHighest = (idea: BusinessIdea, key: keyof BusinessIdea) => {
    const value = (idea[key] as number) ?? 0;
    return value === getHighestScore(key) && value > 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Compare Ideas ({ideas.length})
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${ideas.length}, 1fr)` }}>
          {ideas.map((idea) => (
            <div key={idea.id} className="space-y-4">
              {/* Header */}
              <div className="p-4 rounded-lg bg-card border border-border">
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {idea.industry || "General"}
                </span>
                <h3 className="font-display font-semibold text-lg text-foreground mt-2">
                  {idea.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {idea.description}
                </p>
              </div>

              {/* Scores */}
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="text-sm font-medium text-foreground mb-3">Scores</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Viability</span>
                    <span
                      className={cn(
                        "font-display font-bold text-lg",
                        getScoreColor(idea.viability_score),
                        isHighest(idea, "viability_score") && "underline decoration-2"
                      )}
                    >
                      {idea.viability_score ?? "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Market Fit</span>
                    <span
                      className={cn(
                        "font-display font-bold text-lg",
                        getScoreColor(idea.market_fit_score),
                        isHighest(idea, "market_fit_score") && "underline decoration-2"
                      )}
                    >
                      {idea.market_fit_score ?? "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Skills Match</span>
                    <span
                      className={cn(
                        "font-display font-bold text-lg",
                        getScoreColor(idea.skills_match_score),
                        isHighest(idea, "skills_match_score") && "underline decoration-2"
                      )}
                    >
                      {idea.skills_match_score ?? "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financials */}
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="text-sm font-medium text-foreground mb-3">Financials</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                      <DollarSign className="w-3 h-3" />
                      Startup Cost
                    </div>
                    <div className="font-medium text-foreground">
                      {formatCurrency(idea.startup_cost_min)} - {formatCurrency(idea.startup_cost_max)}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                      <TrendingUp className="w-3 h-3" />
                      Monthly Revenue
                    </div>
                    <div className="font-medium text-success">
                      {formatCurrency(idea.monthly_revenue_min)} - {formatCurrency(idea.monthly_revenue_max)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Wins */}
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-1">
                  <Zap className="w-4 h-4 text-warning" />
                  Quick Wins
                </h4>
                <ul className="space-y-1">
                  {(idea.quick_wins || []).slice(0, 3).map((win, idx) => (
                    <li key={idx} className="flex items-start gap-1 text-xs text-muted-foreground">
                      <ChevronRight className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{win}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
