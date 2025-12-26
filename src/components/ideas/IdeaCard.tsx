import { BusinessIdea } from "@/types/idea";
import { cn } from "@/lib/utils";
import { DollarSign, TrendingUp, Calendar, CheckCircle2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

interface IdeaCardProps {
  idea: BusinessIdea;
  isSelected: boolean;
  isComparing: boolean;
  onSelect: () => void;
  onToggleCompare: () => void;
  viewMode: "grid" | "list";
}

export const IdeaCard = ({
  idea,
  isSelected,
  isComparing,
  onSelect,
  onToggleCompare,
  viewMode,
}: IdeaCardProps) => {
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

  const getScoreBg = (score: number | null): string => {
    if (score === null) return "bg-muted";
    if (score >= 80) return "bg-success/10";
    if (score >= 60) return "bg-warning/10";
    return "bg-muted";
  };

  if (viewMode === "list") {
    return (
      <div
        className={cn(
          "flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-primary/30",
          isSelected ? "border-primary bg-primary/5" : "border-border bg-card",
          isComparing && "ring-2 ring-accent ring-offset-2"
        )}
        onClick={onSelect}
      >
        <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={isComparing}
            onCheckedChange={onToggleCompare}
            className="h-5 w-5"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {idea.industry || "General"}
            </span>
          </div>
          <h3 className="font-display font-semibold text-foreground truncate">
            {idea.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {idea.description}
          </p>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Startup Cost</div>
            <div className="text-sm font-medium text-foreground">
              {formatCurrency(idea.startup_cost_min)} - {formatCurrency(idea.startup_cost_max)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Monthly Rev</div>
            <div className="text-sm font-medium text-success">
              {formatCurrency(idea.monthly_revenue_min)}/mo
            </div>
          </div>
        </div>

        <div className={cn("flex-shrink-0 px-3 py-2 rounded-lg text-center", getScoreBg(idea.viability_score))}>
          <div className={cn("font-display text-xl font-bold", getScoreColor(idea.viability_score))}>
            {idea.viability_score ?? "—"}
          </div>
          <div className="text-xs text-muted-foreground">Score</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "p-5 rounded-xl border-2 transition-all cursor-pointer hover:border-primary/30 card-warm",
        isSelected ? "border-primary bg-primary/5" : "border-border bg-card",
        isComparing && "ring-2 ring-accent ring-offset-2"
      )}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={isComparing}
            onCheckedChange={onToggleCompare}
            className="h-5 w-5"
          />
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
            {idea.industry || "General"}
          </span>
        </div>
        <div className={cn("px-3 py-1 rounded-lg text-center", getScoreBg(idea.viability_score))}>
          <div className={cn("font-display text-xl font-bold", getScoreColor(idea.viability_score))}>
            {idea.viability_score ?? "—"}
          </div>
        </div>
      </div>

      <h3 className="font-display font-semibold text-lg text-foreground mb-2">
        {idea.name}
      </h3>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {idea.description}
      </p>

      <div className="flex flex-wrap gap-3 text-sm">
        <div className="flex items-center gap-1 text-muted-foreground">
          <DollarSign className="w-4 h-4" />
          <span>{formatCurrency(idea.startup_cost_min)} - {formatCurrency(idea.startup_cost_max)}</span>
        </div>
        <div className="flex items-center gap-1 text-success">
          <TrendingUp className="w-4 h-4" />
          <span>{formatCurrency(idea.monthly_revenue_min)}/mo</span>
        </div>
      </div>

      <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
        <Calendar className="w-3 h-3" />
        <span>{format(new Date(idea.created_at), "MMM d, yyyy")}</span>
      </div>
    </div>
  );
};
