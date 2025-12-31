import { useState } from "react";
import { BusinessIdea } from "@/types/idea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DollarSign,
  TrendingUp,
  Target,
  Zap,
  ChevronRight,
  Sparkles,
  X,
  Trash2,
  FileText,
  Loader2,
  MessageCircle,
  Shield,
  Flame,
  Bot,
  Briefcase,
  Globe,
} from "lucide-react";
import { format } from "date-fns";
import { useDocuments } from "@/hooks/useDocuments";
import { useActionPlanProgress } from "@/hooks/useActionPlanProgress";
import { ChatDrawer } from "@/components/chat/ChatDrawer";
import { ActionPlan } from "./ActionPlan";
import { RunwayCalculator } from "./RunwayCalculator";
import { ProvincialTips } from "./ProvincialTips";
import { DeepDiveReport } from "./DeepDiveReport";
import { IdeaBuilder } from "./IdeaBuilder";
import { MarketSignals } from "./MarketSignals";

interface IdeaDetailsPanelProps {
  idea: BusinessIdea | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const IdeaDetailsPanel = ({ idea, onClose, onDelete }: IdeaDetailsPanelProps) => {
  const { generating, generateBusinessPlan } = useDocuments();
  const { toggleTask, isToggling } = useActionPlanProgress();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleToggleTask = (phase: 'day30' | 'day60' | 'day90', taskIndex: number) => {
    if (idea?.action_plan) {
      toggleTask({
        ideaId: idea.id,
        phase,
        taskIndex,
        currentPlan: idea.action_plan,
      });
    }
  };

  const handleExportPDF = async () => {
    if (idea) {
      await generateBusinessPlan(idea.id);
    }
  };

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

  const getPainPointColor = (severity: number | null): string => {
    if (severity === null) return "text-muted-foreground";
    if (severity >= 8) return "text-destructive";
    if (severity >= 6) return "text-warning";
    return "text-muted-foreground";
  };

  const getPainPointLabel = (severity: number | null): string => {
    if (severity === null) return "Unknown";
    if (severity >= 9) return "Hair on Fire";
    if (severity >= 7) return "High Pain";
    if (severity >= 5) return "Moderate";
    return "Nice to Have";
  };

  if (!idea) {
    return (
      <div className="bg-muted/30 rounded-2xl border border-dashed border-border p-12 text-center h-full flex flex-col items-center justify-center">
        <Sparkles className="w-12 h-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground">Select an idea to see details</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card rounded-2xl border border-border p-6 h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {idea.industry || "General"}
              </span>
              {idea.province && (
                <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs">
                  {idea.province}
                </span>
              )}
              {idea.side_hustle_compatible && (
                <span className="px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  Side Hustle
                </span>
              )}
              {idea.newcomer_friendly && (
                <span className="px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  Newcomer OK
                </span>
              )}
              {idea.ai_leverage_score !== null && idea.ai_leverage_score >= 70 && (
                <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium flex items-center gap-1">
                  <Bot className="w-3 h-3" />
                  AI-Powered
                </span>
              )}
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              {idea.name}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Saved {format(new Date(idea.created_at), "MMMM d, yyyy")}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <p className="text-muted-foreground mb-6">{idea.description}</p>

        {/* Core Scores */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className={cn("font-display text-2xl font-bold", getScoreColor(idea.viability_score))}>
              {idea.viability_score ?? "—"}
            </div>
            <div className="text-xs text-muted-foreground">Viability</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className={cn("font-display text-2xl font-bold", getScoreColor(idea.market_fit_score))}>
              {idea.market_fit_score ?? "—"}
            </div>
            <div className="text-xs text-muted-foreground">Market Fit</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className={cn("font-display text-2xl font-bold", getScoreColor(idea.skills_match_score))}>
              {idea.skills_match_score ?? "—"}
            </div>
            <div className="text-xs text-muted-foreground">Skills Match</div>
          </div>
        </div>

        {/* 2026 Enhanced Scores */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg border border-border">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Shield className={cn("w-4 h-4", getScoreColor(idea.recession_resistance_score))} />
            </div>
            <div className={cn("font-display text-xl font-bold", getScoreColor(idea.recession_resistance_score))}>
              {idea.recession_resistance_score ?? "—"}%
            </div>
            <div className="text-xs text-muted-foreground">Recession Resistant</div>
          </div>
          <div className="text-center p-3 rounded-lg border border-border">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Flame className={cn("w-4 h-4", getPainPointColor(idea.pain_point_severity))} />
            </div>
            <div className={cn("font-display text-xl font-bold", getPainPointColor(idea.pain_point_severity))}>
              {idea.pain_point_severity ?? "—"}/10
            </div>
            <div className="text-xs text-muted-foreground">{getPainPointLabel(idea.pain_point_severity)}</div>
          </div>
          <div className="text-center p-3 rounded-lg border border-border">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Bot className={cn("w-4 h-4", getScoreColor(idea.ai_leverage_score))} />
            </div>
            <div className={cn("font-display text-xl font-bold", getScoreColor(idea.ai_leverage_score))}>
              {idea.ai_leverage_score ?? "—"}%
            </div>
            <div className="text-xs text-muted-foreground">AI Leverage</div>
          </div>
        </div>

        {/* Financials */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-lg border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">Startup Cost</span>
            </div>
            <div className="font-display font-bold text-foreground">
              {formatCurrency(idea.startup_cost_min)} - {formatCurrency(idea.startup_cost_max)}
            </div>
          </div>
          <div className="p-4 rounded-lg border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Monthly Revenue</span>
            </div>
            <div className="font-display font-bold text-success">
              {formatCurrency(idea.monthly_revenue_min)} - {formatCurrency(idea.monthly_revenue_max)}
            </div>
          </div>
        </div>

        {/* Financial Runway Calculator */}
        <div className="mb-6">
          <RunwayCalculator idea={idea} />
        </div>

        {/* 30-60-90 Day Action Plan */}
        {idea.action_plan && (
          <div className="mb-6">
            <ActionPlan actionPlan={idea.action_plan} onToggleTask={handleToggleTask} />
          </div>
        )}

        {/* Quick Wins (fallback for older ideas without action plan) */}
        {!idea.action_plan && idea.quick_wins && idea.quick_wins.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-warning" />
              Quick Wins (First 30 Days)
            </h3>
            <ul className="space-y-2">
              {idea.quick_wins.map((win, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  {win}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Grants */}
        {idea.grants && idea.grants.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-accent" />
              Relevant Grants & Funding
            </h3>
            <ul className="space-y-2">
              {idea.grants.map((grant, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <ChevronRight className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  {grant}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Competitors */}
        {idea.competitors && idea.competitors.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3">Key Competitors</h3>
            <div className="flex flex-wrap gap-2">
              {idea.competitors.map((comp, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground">
                  {comp}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Provincial Tips */}
        {idea.province && (
          <div className="mb-6">
            <ProvincialTips idea={idea} />
          </div>
        )}

        {/* Deep Dive Research Report */}
        <div className="mb-6">
          <DeepDiveReport idea={idea} />
        </div>

        {/* SPARK Idea Builder */}
        <div className="mb-6">
          <IdeaBuilder idea={idea} />
        </div>

        {/* Real-Time Market Signals */}
        <div className="mb-6">
          <MarketSignals idea={idea} />
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-border space-y-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsChatOpen(true)}
            className="w-full gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Ask AI About This Idea
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="default"
              size="sm"
              onClick={handleExportPDF}
              disabled={generating}
              className="gap-2 flex-1"
            >
              {generating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
              {generating ? "Generating..." : "Export Business Plan"}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(idea.id)}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        idea={idea}
      />
    </>
  );
};
