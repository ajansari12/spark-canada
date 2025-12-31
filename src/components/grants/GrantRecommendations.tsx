import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Target, ChevronRight, Sparkles, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGrantMatching, UserGrantProfile } from "@/hooks/useGrantMatching";
import { GrantMatchCard } from "./GrantMatchCard";

interface GrantRecommendationsProps {
  limit?: number;
  customProfile?: Partial<UserGrantProfile>;
  showViewAll?: boolean;
  compact?: boolean;
  title?: string;
  description?: string;
}

export const GrantRecommendations = ({
  limit = 3,
  customProfile,
  showViewAll = true,
  compact = false,
  title = "Recommended Grants for You",
  description = "Based on your profile and interests",
}: GrantRecommendationsProps) => {
  const { isLoading, getTopRecommendations, getHighPriorityGrants, userProfile } = useGrantMatching();

  const topMatches = useMemo(() => {
    return getTopRecommendations(limit, customProfile);
  }, [getTopRecommendations, limit, customProfile]);

  const highPriorityCount = useMemo(() => {
    return getHighPriorityGrants(customProfile).length;
  }, [getHighPriorityGrants, customProfile]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-1" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(limit)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (topMatches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">
              {userProfile
                ? "We couldn't find matching grants based on your profile. Try broadening your criteria."
                : "Complete the wizard to get personalized grant recommendations."}
            </p>
            {!userProfile && (
              <Button asChild className="gap-2">
                <Link to="/wizard">
                  <Sparkles className="w-4 h-4" />
                  Get Started
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              {title}
            </CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          {highPriorityCount > 0 && (
            <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
              {highPriorityCount} high priority
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {topMatches.map((match) => (
          <GrantMatchCard key={match.grant.id} match={match} compact={compact} />
        ))}

        {showViewAll && (
          <Button variant="ghost" className="w-full gap-2" asChild>
            <Link to="/app/grants">
              View All Grants
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default GrantRecommendations;
