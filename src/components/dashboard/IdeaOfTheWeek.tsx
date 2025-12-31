import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Star,
  Sparkles,
  Target,
  TrendingUp,
  Check,
  Shield,
  Flame,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useIdeaOfTheWeek } from "@/hooks/useIdeaOfTheWeek";
import { cn } from "@/lib/utils";

interface IdeaOfTheWeekProps {
  className?: string;
}

const IdeaOfTheWeekSkeleton = () => (
  <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
    <CardHeader>
      <div className="flex items-center gap-2 mb-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-7 w-3/4" />
      <Skeleton className="h-5 w-1/2 mt-1" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-16 w-full mb-4" />
      <div className="grid grid-cols-3 gap-3 mb-4">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
      <Skeleton className="h-10 w-full" />
    </CardContent>
  </Card>
);

export const IdeaOfTheWeek = ({ className }: IdeaOfTheWeekProps) => {
  const navigate = useNavigate();
  const { ideaOfWeek, isLoading, trackClick, weekStart, weekEnd, getFullIdea } = useIdeaOfTheWeek();

  if (isLoading) {
    return <IdeaOfTheWeekSkeleton />;
  }

  if (!ideaOfWeek) {
    return null;
  }

  const fullIdea = getFullIdea();

  const handleWizardClick = () => {
    trackClick('wizard');
    navigate('/wizard');
  };

  const handleGrantsClick = () => {
    trackClick('grants');
    navigate('/app/grants');
  };

  const handleDetailsClick = () => {
    trackClick('details');
    navigate('/idea-database');
  };

  return (
    <Card className={cn(
      "border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <Badge className="bg-gradient-warm text-white border-0 gap-1">
            <Star className="w-3 h-3" />
            Idea of the Week
          </Badge>
          <span className="text-xs text-muted-foreground">
            {format(new Date(weekStart), 'MMM d')} – {format(new Date(weekEnd), 'MMM d, yyyy')}
          </span>
        </div>
        <CardTitle className="text-xl leading-tight">{ideaOfWeek.headline}</CardTitle>
        <CardDescription className="text-base font-medium text-foreground/80">
          {ideaOfWeek.idea_name}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {ideaOfWeek.idea_description}
        </p>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="font-bold text-lg text-green-600">
              {ideaOfWeek.viability_score}%
            </div>
            <div className="text-xs text-muted-foreground">Viability</div>
          </div>

          <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
              <Shield className="w-4 h-4" />
            </div>
            <div className="font-bold text-lg text-blue-600">
              {ideaOfWeek.recession_resistance}%
            </div>
            <div className="text-xs text-muted-foreground">Recession-Proof</div>
          </div>

          <div className="text-center p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
              <Flame className="w-4 h-4" />
            </div>
            <div className="font-bold text-lg text-orange-600">
              {ideaOfWeek.pain_point_severity}/10
            </div>
            <div className="text-xs text-muted-foreground">Pain Point</div>
          </div>
        </div>

        {/* Highlight Points */}
        {ideaOfWeek.highlight_points && ideaOfWeek.highlight_points.length > 0 && (
          <div className="space-y-2">
            {ideaOfWeek.highlight_points.map((point, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        )}

        {/* Why Now Box */}
        {ideaOfWeek.why_now && (
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-2 text-sm font-medium text-accent-foreground mb-1">
              <TrendingUp className="w-4 h-4 text-accent" />
              Why Now?
            </div>
            <p className="text-sm text-muted-foreground">{ideaOfWeek.why_now}</p>
          </div>
        )}

        {/* Additional Details */}
        {fullIdea && (
          <div className="flex flex-wrap gap-2">
            {fullIdea.sideHustleCompatible && (
              <Badge variant="outline" className="text-xs">
                Side Hustle OK
              </Badge>
            )}
            {fullIdea.newcomerFriendly && (
              <Badge variant="outline" className="text-xs">
                Newcomer Friendly
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {fullIdea.industry}
            </Badge>
            {fullIdea.startupCostMin && fullIdea.startupCostMax && (
              <Badge variant="outline" className="text-xs">
                ${fullIdea.startupCostMin.toLocaleString()} - ${fullIdea.startupCostMax.toLocaleString()}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button
            className="flex-1 btn-gradient gap-2"
            onClick={handleWizardClick}
          >
            <Sparkles className="w-4 h-4" />
            Generate Similar Ideas
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={handleGrantsClick}
          >
            <Target className="w-4 h-4" />
            Find Matching Grants
          </Button>
        </div>

        {/* View More Link */}
        <Button
          variant="ghost"
          className="w-full gap-2 text-muted-foreground hover:text-foreground"
          onClick={handleDetailsClick}
        >
          Explore All Pre-Validated Ideas
          <ChevronRight className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default IdeaOfTheWeek;
