import { ExternalLink, Calendar, DollarSign, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GrantMatch } from "@/hooks/useGrantMatching";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface GrantMatchCardProps {
  match: GrantMatch;
  compact?: boolean;
}

export const GrantMatchCard = ({ match, compact = false }: GrantMatchCardProps) => {
  const { grant, matchPercentage, matchReasons, missingRequirements, priority } = match;

  const priorityColors = {
    high: "border-green-500/30 bg-green-500/5",
    medium: "border-yellow-500/30 bg-yellow-500/5",
    low: "border-border",
  };

  const priorityBadgeColors = {
    high: "bg-green-500/10 text-green-600 border-green-500/20",
    medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    low: "bg-muted text-muted-foreground",
  };

  const formatFunding = (min: number | null, max: number | null): string => {
    if (min && max) {
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    }
    if (max) {
      return `Up to $${max.toLocaleString()}`;
    }
    if (min) {
      return `From $${min.toLocaleString()}`;
    }
    return "Varies";
  };

  if (compact) {
    return (
      <Card className={cn("transition-colors hover:bg-accent/5", priorityColors[priority])}>
        <CardContent className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm truncate">{grant.name}</h4>
                <Badge variant="outline" className={cn("text-xs shrink-0", priorityBadgeColors[priority])}>
                  {matchPercentage}% match
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {formatFunding(grant.funding_min, grant.funding_max)}
                {grant.deadline && ` • Due ${format(new Date(grant.deadline), 'MMM d')}`}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" asChild>
              <a href={grant.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("transition-colors", priorityColors[priority])}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className={cn("shrink-0", priorityBadgeColors[priority])}>
                {priority === 'high' ? 'Top Pick' : priority === 'medium' ? 'Good Fit' : 'Consider'}
              </Badge>
              {grant.province && (
                <Badge variant="secondary" className="text-xs">
                  {grant.province === 'Federal' ? '🇨🇦 Federal' : grant.province}
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-base">{grant.name}</h3>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-bold text-primary">{matchPercentage}%</div>
            <div className="text-xs text-muted-foreground">match</div>
          </div>
        </div>

        {/* Match Progress */}
        <div className="mb-4">
          <Progress value={matchPercentage} className="h-2" />
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {grant.description}
        </p>

        {/* Key Details */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span>{formatFunding(grant.funding_min, grant.funding_max)}</span>
          </div>
          {grant.deadline && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span>Due {format(new Date(grant.deadline), 'MMM d, yyyy')}</span>
            </div>
          )}
          {match.estimatedApprovalWeeks && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>~{match.estimatedApprovalWeeks} weeks approval</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline" className="text-xs">
              {grant.grant_type === 'grant' ? 'Grant' :
               grant.grant_type === 'loan' ? 'Loan' : 'Tax Credit'}
            </Badge>
          </div>
        </div>

        {/* Match Reasons */}
        {matchReasons.length > 0 && (
          <div className="mb-3">
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Why this matches you:</h4>
            <div className="space-y-1">
              {matchReasons.slice(0, 4).map((reason, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Missing Requirements (if any) */}
        {missingRequirements.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Things to note:</h4>
            <div className="space-y-1">
              {missingRequirements.slice(0, 2).map((req, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action */}
        <Button className="w-full gap-2" asChild>
          <a href={grant.url} target="_blank" rel="noopener noreferrer">
            View Application
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default GrantMatchCard;
