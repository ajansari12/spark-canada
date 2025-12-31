import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  RefreshCw,
  Loader2,
  AlertCircle,
  Target,
  Clock,
  ExternalLink,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  useMarketSignals,
  MarketSignals as MarketSignalsType,
  getSentimentColor,
  getTimingScoreColor,
} from "@/hooks/useMarketSignals";
import { BusinessIdea } from "@/types/idea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface MarketSignalsProps {
  idea: BusinessIdea;
  className?: string;
}

export const MarketSignals = ({ idea, className }: MarketSignalsProps) => {
  const { fetchSignals, signals, isLoading, error, reset } = useMarketSignals();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFetchSignals = () => {
    reset();
    fetchSignals({
      ideaName: idea.name,
      industry: idea.industry || 'General',
      province: idea.province || 'Ontario',
      competitors: idea.competitors,
    });
  };

  const handleExpand = () => {
    setIsExpanded(true);
    if (!signals && !isLoading) {
      handleFetchSignals();
    }
  };

  // Collapsed state - just a button
  if (!isExpanded) {
    return (
      <Button
        variant="outline"
        onClick={handleExpand}
        className={cn("w-full gap-2", className)}
      >
        <TrendingUp className="w-4 h-4" />
        Get Real-Time Market Signals
        <Badge variant="secondary" className="ml-2 text-xs">AI-Powered</Badge>
      </Button>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="w-5 h-5 text-primary" />
              Real-Time Market Signals
            </CardTitle>
            <CardDescription>AI-powered market analysis for {idea.name}</CardDescription>
          </div>
          {signals && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFetchSignals}
              disabled={isLoading}
              className="h-8 w-8"
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2 text-primary" />
            <span className="text-muted-foreground">Analyzing market signals...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              Failed to fetch market signals. Please try again.
              <Button variant="link" onClick={handleFetchSignals} className="p-0 h-auto ml-2">
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {signals && <MarketSignalsDisplay signals={signals} />}
      </CardContent>
    </Card>
  );
};

// Separate component for displaying signals
const MarketSignalsDisplay = ({ signals }: { signals: MarketSignalsType }) => {
  const SentimentIcon = signals.marketConditions.sentiment === 'positive'
    ? TrendingUp
    : signals.marketConditions.sentiment === 'negative'
      ? TrendingDown
      : Minus;

  return (
    <div className="space-y-4">
      {/* Timing Score - Most Important */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Market Timing</span>
          </div>
          <p className="text-sm text-muted-foreground">{signals.timingReason}</p>
        </div>
        <div className="text-right ml-4">
          <div className={cn("text-3xl font-bold", getTimingScoreColor(signals.timingScore))}>
            {signals.timingScore}/10
          </div>
          <Progress
            value={signals.timingScore * 10}
            className="h-2 w-20 mt-1"
          />
        </div>
      </div>

      {/* Market Conditions */}
      <div>
        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
          <SentimentIcon className={cn("w-4 h-4", getSentimentColor(signals.marketConditions.sentiment))} />
          Market Conditions
          <Badge
            variant={signals.marketConditions.sentiment === 'positive' ? 'default' :
                    signals.marketConditions.sentiment === 'negative' ? 'destructive' : 'secondary'}
            className="ml-auto"
          >
            {signals.marketConditions.sentiment}
          </Badge>
        </h4>
        <ul className="space-y-1">
          {signals.marketConditions.factors.map((factor, i) => (
            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
              <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {factor}
            </li>
          ))}
        </ul>
      </div>

      {/* Trends */}
      {signals.trends.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            Current Trends
          </h4>
          <ul className="space-y-1">
            {signals.trends.map((trend, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                {trend}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Competitive Landscape */}
      <div>
        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
          <Target className="w-4 h-4 text-accent" />
          Competitive Landscape
          <Badge
            variant={signals.competitiveLandscape.saturation === 'low' ? 'default' :
                    signals.competitiveLandscape.saturation === 'high' ? 'destructive' : 'secondary'}
            className="ml-auto"
          >
            {signals.competitiveLandscape.saturation} saturation
          </Badge>
        </h4>
        {signals.competitiveLandscape.opportunities.length > 0 && (
          <ul className="space-y-1">
            {signals.competitiveLandscape.opportunities.map((opp, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <Target className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                {opp}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Seasonality */}
      {signals.seasonality && (
        <div className="grid grid-cols-2 gap-3">
          {signals.seasonality.bestMonths.length > 0 && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="text-xs font-medium text-green-600 mb-1">Best Months</div>
              <div className="text-sm">{signals.seasonality.bestMonths.join(', ')}</div>
            </div>
          )}
          {signals.seasonality.slowMonths.length > 0 && (
            <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <div className="text-xs font-medium text-orange-600 mb-1">Slower Months</div>
              <div className="text-sm">{signals.seasonality.slowMonths.join(', ')}</div>
            </div>
          )}
        </div>
      )}

      {/* Citations */}
      {signals.citations && signals.citations.length > 0 && (
        <div className="pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground">Sources:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {signals.citations.slice(0, 5).map((citation, i) => (
              <a
                key={i}
                href={citation}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline inline-flex items-center gap-1"
              >
                [{i + 1}]
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-xs text-muted-foreground text-right pt-2">
        Generated {format(new Date(signals.generatedAt), 'MMM d, yyyy h:mm a')}
        {signals.provider && ` via ${signals.provider}`}
      </div>
    </div>
  );
};

export default MarketSignals;
