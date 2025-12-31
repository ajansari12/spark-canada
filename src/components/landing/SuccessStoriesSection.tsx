import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  Quote,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Globe,
} from "lucide-react";
import { useSuccessStories } from "@/hooks/useSuccessStories";
import { Link } from "react-router-dom";

export function SuccessStoriesSection() {
  const { featuredStories, stats, isLoading, formatCurrency } = useSuccessStories();

  if (isLoading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Canadian Success Stories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Loading stories...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse bg-card/50">
                <CardContent className="pt-6">
                  <div className="h-24 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If no featured stories yet, show a placeholder
  if (featuredStories.length === 0) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Star className="w-12 h-12 text-warning mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Canadian Success Stories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Be the first to share your success story! Help inspire the next generation of
              Canadian entrepreneurs.
            </p>
            <Link to="/success-stories">
              <Button variant="outline" className="gap-2">
                Share Your Story <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 bg-warning/10 text-warning border-warning/20">
            <Star className="w-3 h-3 mr-1 fill-warning" />
            Real Results
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Canadian Success Stories
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real entrepreneurs who turned their SPARK ideas into thriving Canadian businesses.
          </p>
        </div>

        {/* Stats Row */}
        {stats.totalStories > 0 && (
          <div className="flex justify-center gap-8 mb-12 flex-wrap">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{stats.totalStories}+</div>
              <div className="text-sm text-muted-foreground">Success Stories</div>
            </div>
            {stats.avgMonthlyRevenue > 0 && (
              <div className="text-center">
                <div className="text-3xl font-bold text-success">
                  {formatCurrency(stats.avgMonthlyRevenue)}
                </div>
                <div className="text-sm text-muted-foreground">Avg. Monthly Revenue</div>
              </div>
            )}
            {stats.sideHustlerCount > 0 && (
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">{stats.sideHustlerCount}</div>
                <div className="text-sm text-muted-foreground">Side Hustlers</div>
              </div>
            )}
          </div>
        )}

        {/* Featured Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {featuredStories.map((story) => (
            <Card
              key={story.id}
              className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300"
            >
              <CardContent className="pt-6">
                {/* Quote */}
                {story.quote && (
                  <div className="mb-4">
                    <Quote className="w-6 h-6 text-primary/30 mb-2" />
                    <p className="text-foreground italic">"{story.quote}"</p>
                  </div>
                )}

                {/* Business Info */}
                <div className="mb-4">
                  <h3 className="font-semibold text-foreground">{story.business_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {story.industry} • {story.province}
                  </p>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-4 mb-4">
                  {story.monthly_revenue && (
                    <div className="flex items-center gap-1 text-success">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-medium">{formatCurrency(story.monthly_revenue)}/mo</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex gap-2">
                  {story.is_side_hustle && (
                    <Badge variant="secondary" className="text-xs">
                      <Briefcase className="w-3 h-3 mr-1" />
                      Side Hustle
                    </Badge>
                  )}
                  {story.is_newcomer && (
                    <Badge variant="secondary" className="text-xs">
                      <Globe className="w-3 h-3 mr-1" />
                      Newcomer
                    </Badge>
                  )}
                </div>

                {/* Attribution */}
                <p className="text-xs text-muted-foreground mt-4">
                  — {story.is_anonymous ? "Anonymous" : story.display_name || "SPARK User"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/success-stories">
            <Button variant="outline" className="gap-2">
              View All Success Stories <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
