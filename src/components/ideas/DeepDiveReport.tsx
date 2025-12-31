import { useState } from "react";
import { BusinessIdea } from "@/types/idea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Target,
  Scale,
  DollarSign,
  Zap,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles,
  Building2,
  MapPin,
  Clock,
  Award,
} from "lucide-react";
import { useDeepDive, DeepDiveReport as DeepDiveReportType } from "@/hooks/useDeepDive";
import { format } from "date-fns";

interface DeepDiveReportProps {
  idea: BusinessIdea;
}

export const DeepDiveReport = ({ idea }: DeepDiveReportProps) => {
  const {
    currentReport,
    setCurrentReport,
    generateReport,
    isGenerating,
    getCachedReport,
    hasReport,
    getScoreColor,
    getScoreBg,
    getTrendInfo,
    getComplexityInfo,
    getPriorityColor,
  } = useDeepDive();

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>("overview");

  // Check for cached report on mount
  const cachedReport = getCachedReport(idea.id);
  const report = currentReport?.ideaId === idea.id ? currentReport : cachedReport;

  const handleGenerate = () => {
    generateReport({ idea });
  };

  const sections = [
    { id: "overview", label: "Overview", icon: Sparkles },
    { id: "market", label: "Market", icon: TrendingUp },
    { id: "competition", label: "Competition", icon: Target },
    { id: "regulations", label: "Regulations", icon: Scale },
    { id: "funding", label: "Funding", icon: DollarSign },
    { id: "execution", label: "Execution", icon: Zap },
  ];

  const TrendIcon = report?.growthTrend === 'rising' ? TrendingUp :
                    report?.growthTrend === 'declining' ? TrendingDown : Minus;

  if (!report) {
    return (
      <div className="border border-border rounded-xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold text-lg text-foreground mb-2">
            SPARK Deep Dive
          </h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            Get comprehensive Canadian market research, competition analysis, regulatory guidance, and funding opportunities for this business idea.
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            ⏱️ Takes about 30 seconds • 📊 50+ hours of research condensed
          </p>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="btn-gradient gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Researching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Generate Deep Dive Report
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/15 hover:to-accent/15 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold",
            getScoreBg(report.overallScore),
            getScoreColor(report.overallScore)
          )}>
            {report.overallScore}
          </div>
          <div className="text-left">
            <div className="font-semibold text-foreground flex items-center gap-2">
              Deep Dive Report
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                Complete
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Generated {format(new Date(report.generatedAt), "MMM d, yyyy 'at' h:mm a")}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 bg-background">
          {/* Section Navigation */}
          <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-border">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {section.label}
                </button>
              );
            })}
          </div>

          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="space-y-4">
              {/* Score Cards */}
              <div className="grid grid-cols-3 gap-3">
                <ScoreCard
                  label="Market Size"
                  score={report.marketSizeScore}
                  getColor={getScoreColor}
                  getBg={getScoreBg}
                />
                <ScoreCard
                  label="Competition"
                  score={report.competitionScore}
                  getColor={getScoreColor}
                  getBg={getScoreBg}
                />
                <ScoreCard
                  label="Demand"
                  score={report.communityDemandScore}
                  getColor={getScoreColor}
                  getBg={getScoreBg}
                />
                <ScoreCard
                  label="Regulations"
                  score={report.regulatoryEaseScore}
                  getColor={getScoreColor}
                  getBg={getScoreBg}
                />
                <ScoreCard
                  label="Funding"
                  score={report.fundingAvailabilityScore}
                  getColor={getScoreColor}
                  getBg={getScoreBg}
                />
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <div className={cn("text-2xl mb-1", getTrendInfo(report.growthTrend).color)}>
                    <TrendIcon className="w-6 h-6 mx-auto" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {getTrendInfo(report.growthTrend).label}
                  </div>
                </div>
              </div>

              {/* Pain Point */}
              <div className="p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className={cn(
                    "w-5 h-5",
                    report.painPointSeverity >= 7 ? "text-destructive" : "text-warning"
                  )} />
                  <span className="font-medium">Pain Point Severity: {report.painPointSeverity}/10</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {report.painPointDescription}
                </p>
                <div className="flex flex-wrap gap-1">
                  {report.painPointSources.map((source, idx) => (
                    <span key={idx} className="text-xs px-2 py-0.5 rounded-full bg-muted">
                      {source}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Wins */}
              <div className="p-4 rounded-lg border border-success/20 bg-success/5">
                <h4 className="font-medium text-success flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4" />
                  Quick Wins
                </h4>
                <ul className="space-y-1">
                  {report.quickWins.map((win, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      {win}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Market Section */}
          {activeSection === "market" && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  Canadian Market Size
                </h4>
                <p className="text-2xl font-bold text-primary">{report.canadianTAM}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Provincial Opportunities
                </h4>
                <div className="space-y-2">
                  {Object.entries(report.provincialOpportunities).map(([province, opportunity]) => (
                    <div key={province} className="p-3 rounded-lg border border-border">
                      <span className="font-medium text-primary">{province}:</span>
                      <span className="text-sm text-muted-foreground ml-2">{opportunity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Market Insights</h4>
                <ul className="space-y-1">
                  {report.marketInsights.map((insight, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Target Audience
                </h4>
                <div className="flex flex-wrap gap-2">
                  {report.targetAudience.map((audience, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                      {audience}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Competition Section */}
          {activeSection === "competition" && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium mb-1">Canadian Competitors</h4>
                <p className="text-lg font-semibold">{report.competitorCount}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Top Competitors</h4>
                <div className="space-y-2">
                  {report.topCompetitors.map((competitor, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-border">
                      <div className="font-medium">{competitor.name}</div>
                      <p className="text-sm text-muted-foreground">{competitor.description}</p>
                      <p className="text-sm text-destructive mt-1">
                        <span className="font-medium">Weakness:</span> {competitor.weakness}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-success">Market Gaps to Exploit</h4>
                <ul className="space-y-1">
                  {report.marketGaps.map((gap, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <Target className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      {gap}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Differentiation Strategies</h4>
                <ul className="space-y-1">
                  {report.differentiationStrategies.map((strategy, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">→</span>
                      {strategy}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Regulations Section */}
          {activeSection === "regulations" && (
            <div className="space-y-4">
              <div className={cn(
                "p-4 rounded-lg",
                getComplexityInfo(report.complianceComplexity).color === 'text-success' ? 'bg-success/10' :
                getComplexityInfo(report.complianceComplexity).color === 'text-warning' ? 'bg-warning/10' : 'bg-destructive/10'
              )}>
                <h4 className={cn("font-medium", getComplexityInfo(report.complianceComplexity).color)}>
                  Compliance Complexity: {getComplexityInfo(report.complianceComplexity).label}
                </h4>
              </div>

              <div>
                <h4 className="font-medium mb-2">Federal Requirements</h4>
                <ul className="space-y-1">
                  {report.federalRequirements.map((req, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <Scale className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Provincial Requirements</h4>
                <ul className="space-y-1">
                  {report.provincialRequirements.map((req, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Licenses & Permits Needed</h4>
                <div className="flex flex-wrap gap-2">
                  {report.licensesNeeded.map((license, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full border border-border text-sm">
                      {license}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Funding Section */}
          {activeSection === "funding" && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  Matched Canadian Grants & Funding
                </h4>
                <div className="space-y-2">
                  {report.matchedGrants.map((grant, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-primary/20 bg-primary/5">
                      <div className="font-medium text-primary">{grant.name}</div>
                      <div className="text-lg font-bold">{grant.amount}</div>
                      <p className="text-sm text-muted-foreground">{grant.eligibility}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Funding Strategies</h4>
                <ul className="space-y-1">
                  {report.fundingStrategies.map((strategy, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <DollarSign className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      {strategy}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Execution Section */}
          {activeSection === "execution" && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Critical Milestones
                </h4>
                <div className="space-y-2">
                  {report.criticalMilestones.map((milestone, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "p-3 rounded-lg border",
                        getPriorityColor(milestone.priority)
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium uppercase">{milestone.timeline}</span>
                        <span className="text-xs uppercase">{milestone.priority}</span>
                      </div>
                      <p className="text-sm font-medium">{milestone.milestone}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-warning flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Potential Challenges
                </h4>
                <ul className="space-y-1">
                  {report.potentialChallenges.map((challenge, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-warning">⚠</span>
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-success flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Key Success Factors
                </h4>
                <ul className="space-y-1">
                  {report.successFactors.map((factor, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Best Acquisition Channels</h4>
                <div className="flex flex-wrap gap-2">
                  {report.customerAcquisitionChannels.map((channel, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm">
                      {channel}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Regenerate Button */}
          <div className="mt-4 pt-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Regenerate Report
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Score Card Component
const ScoreCard = ({
  label,
  score,
  getColor,
  getBg,
}: {
  label: string;
  score: number;
  getColor: (score: number) => string;
  getBg: (score: number) => string;
}) => (
  <div className={cn("p-3 rounded-lg text-center", getBg(score))}>
    <div className={cn("text-2xl font-bold", getColor(score))}>{score}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);
