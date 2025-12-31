import { useState } from "react";
import { Link } from "react-router-dom";
import { usePreValidatedIdeas } from "@/hooks/usePreValidatedIdeas";
import { PreValidatedIdea } from "@/types/prevalidated";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Database,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  DollarSign,
  Shield,
  Flame,
  Bot,
  Briefcase,
  Globe,
  MapPin,
  Users,
  Target,
  ChevronDown,
  ChevronUp,
  Star,
  Sparkles,
  ArrowRight,
  Filter,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const IdeaDatabase = () => {
  const {
    ideas,
    featuredIdeas,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    industries,
    provinces,
    totalCount,
  } = usePreValidatedIdeas();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const formatCurrency = (value: number): string => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  const getTrendIcon = (trend: "rising" | "stable" | "declining") => {
    switch (trend) {
      case "rising":
        return <TrendingUp className="w-4 h-4 text-success" />;
      case "declining":
        return <TrendingDown className="w-4 h-4 text-destructive" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: "rising" | "stable" | "declining") => {
    switch (trend) {
      case "rising":
        return "text-success bg-success/10";
      case "declining":
        return "text-destructive bg-destructive/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 85) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-muted-foreground";
  };

  const getPainColor = (severity: number): string => {
    if (severity >= 8) return "text-destructive";
    if (severity >= 6) return "text-warning";
    return "text-muted-foreground";
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      industry: null,
      province: null,
      sideHustleOnly: false,
      newcomerFriendlyOnly: false,
      minViability: null,
      growthTrend: null,
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.industry ||
    filters.province ||
    filters.sideHustleOnly ||
    filters.newcomerFriendlyOnly ||
    filters.minViability !== null ||
    filters.growthTrend !== null;

  const renderIdeaCard = (idea: PreValidatedIdea, isFeatured: boolean = false) => {
    const isExpanded = expandedId === idea.id;

    return (
      <Card
        key={idea.id}
        className={cn(
          "transition-all duration-200 hover:shadow-lg cursor-pointer",
          isFeatured && "border-primary/30 bg-primary/5",
          isExpanded && "ring-2 ring-primary"
        )}
        onClick={() => setExpandedId(isExpanded ? null : idea.id)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  {idea.industry}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn("text-xs gap-1", getTrendColor(idea.growthTrend))}
                >
                  {getTrendIcon(idea.growthTrend)}
                  {idea.growthTrend}
                </Badge>
                {isFeatured && (
                  <Badge className="bg-gradient-warm text-white text-xs gap-1">
                    <Star className="w-3 h-3" />
                    Featured
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg leading-tight">{idea.name}</CardTitle>
              <CardDescription className="mt-1 line-clamp-2">
                {idea.description}
              </CardDescription>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="flex flex-wrap gap-3 mt-3">
            <div className="flex items-center gap-1 text-sm">
              <Target className={cn("w-4 h-4", getScoreColor(idea.viabilityScore))} />
              <span className={cn("font-medium", getScoreColor(idea.viabilityScore))}>
                {idea.viabilityScore}%
              </span>
              <span className="text-muted-foreground text-xs">viability</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Flame className={cn("w-4 h-4", getPainColor(idea.painPointSeverity))} />
              <span className={cn("font-medium", getPainColor(idea.painPointSeverity))}>
                {idea.painPointSeverity}/10
              </span>
              <span className="text-muted-foreground text-xs">pain</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              {formatCurrency(idea.startupCostMin)} - {formatCurrency(idea.startupCostMax)}
            </div>
          </div>

          {/* Badges Row */}
          <div className="flex flex-wrap gap-2 mt-3">
            {idea.sideHustleCompatible && (
              <Badge variant="outline" className="text-xs gap-1 bg-accent/10 text-accent border-accent/30">
                <Briefcase className="w-3 h-3" />
                Side Hustle
              </Badge>
            )}
            {idea.newcomerFriendly && (
              <Badge variant="outline" className="text-xs gap-1 bg-success/10 text-success border-success/30">
                <Globe className="w-3 h-3" />
                Newcomer OK
              </Badge>
            )}
            {idea.aiLeverageScore >= 70 && (
              <Badge variant="outline" className="text-xs gap-1 bg-blue-500/10 text-blue-500 border-blue-500/30">
                <Bot className="w-3 h-3" />
                AI-Powered
              </Badge>
            )}
            {idea.recessionResistanceScore >= 80 && (
              <Badge variant="outline" className="text-xs gap-1 bg-purple-500/10 text-purple-500 border-purple-500/30">
                <Shield className="w-3 h-3" />
                Recession-Proof
              </Badge>
            )}
          </div>
        </CardHeader>

        {/* Expanded Content */}
        {isExpanded && (
          <CardContent className="pt-0 border-t border-border mt-3">
            <div className="space-y-4 pt-4">
              {/* Market Data */}
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Market Overview
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">Market Size</span>
                    <p className="font-medium">{idea.marketSize}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">Competitors</span>
                    <p className="font-medium">{idea.competitorCount} major players</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">Search Volume</span>
                    <p className="font-medium">{idea.searchVolume}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">Reddit Mentions</span>
                    <p className="font-medium">{idea.redditMentions.toLocaleString()}/month</p>
                  </div>
                </div>
              </div>

              {/* Revenue Potential */}
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-success" />
                  Revenue Potential
                </h4>
                <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                  <p className="text-success font-bold text-lg">
                    {formatCurrency(idea.monthlyRevenueMin)} - {formatCurrency(idea.monthlyRevenueMax)}/month
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Startup investment: {formatCurrency(idea.startupCostMin)} - {formatCurrency(idea.startupCostMax)}
                  </p>
                </div>
              </div>

              {/* Top Competitors */}
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-warning" />
                  Top Competitors
                </h4>
                <div className="flex flex-wrap gap-2">
                  {idea.topCompetitors.map((comp, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {comp}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Best Provinces */}
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Best Provinces
                </h4>
                <div className="flex flex-wrap gap-2">
                  {idea.bestProvinces.map((prov, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {prov}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Grants */}
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-accent" />
                  Relevant Grants
                </h4>
                <ul className="space-y-1">
                  {idea.relevantGrants.map((grant, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-accent">•</span>
                      {grant}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Regulatory Notes */}
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-destructive" />
                  Regulatory Considerations
                </h4>
                <ul className="space-y-1">
                  {idea.regulatoryNotes.map((note, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-destructive">•</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Scores Grid */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <div className={cn("font-bold text-lg", getScoreColor(idea.viabilityScore))}>
                    {idea.viabilityScore}%
                  </div>
                  <div className="text-xs text-muted-foreground">Viability</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <div className={cn("font-bold text-lg", getScoreColor(idea.recessionResistanceScore))}>
                    {idea.recessionResistanceScore}%
                  </div>
                  <div className="text-xs text-muted-foreground">Recession</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <div className={cn("font-bold text-lg", getPainColor(idea.painPointSeverity))}>
                    {idea.painPointSeverity}/10
                  </div>
                  <div className="text-xs text-muted-foreground">Pain Point</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <div className={cn("font-bold text-lg", getScoreColor(idea.aiLeverageScore))}>
                    {idea.aiLeverageScore}%
                  </div>
                  <div className="text-xs text-muted-foreground">AI Leverage</div>
                </div>
              </div>

              {/* Research Hours Badge */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {idea.researchHours}+ hours of research
                </div>
                <div className="text-xs text-muted-foreground">
                  Updated {format(new Date(idea.lastUpdated), "MMM d, yyyy")}
                </div>
              </div>

              {/* CTA */}
              <Button asChild className="w-full btn-gradient gap-2">
                <Link to="/wizard">
                  <Sparkles className="w-4 h-4" />
                  Generate Personalized Version
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        )}

        {/* Expand/Collapse Indicator */}
        <div className="flex justify-center pb-2">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Sub-header */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-warm flex items-center justify-center">
                <Database className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-foreground">
                Idea Database
              </span>
              <Badge variant="secondary" className="text-xs">
                {totalCount} validated ideas
              </Badge>
            </div>

            <Button asChild className="btn-gradient gap-2">
              <Link to="/wizard">
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Generate Custom Ideas</span>
                <span className="sm:hidden">Custom</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Pre-Validated Canadian Business Ideas
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each idea represents 50+ hours of market research. Browse curated opportunities
            validated for the Canadian market, with real data on competition, regulations, and funding.
          </p>
        </div>

        {/* Featured Ideas */}
        {!hasActiveFilters && featuredIdeas.length > 0 && (
          <div className="mb-8">
            <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-warning" />
              Featured This Week
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredIdeas.slice(0, 3).map((idea) => renderIdeaCard(idea, true))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search ideas..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-9"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viability-high">Highest Viability</SelectItem>
                <SelectItem value="viability-low">Lowest Viability</SelectItem>
                <SelectItem value="pain-high">Highest Pain Point</SelectItem>
                <SelectItem value="recession-high">Most Recession-Proof</SelectItem>
                <SelectItem value="cost-low">Lowest Cost</SelectItem>
                <SelectItem value="cost-high">Highest Cost</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter Toggle */}
            <Button
              variant={showFilters ? "secondary" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                  !
                </Badge>
              )}
            </Button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <Card className="p-4">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Industry */}
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Select
                    value={filters.industry || "all"}
                    onValueChange={(v) =>
                      setFilters({ ...filters, industry: v === "all" ? null : v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All industries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All industries</SelectItem>
                      {industries.map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Province */}
                <div className="space-y-2">
                  <Label>Best Province</Label>
                  <Select
                    value={filters.province || "all"}
                    onValueChange={(v) =>
                      setFilters({ ...filters, province: v === "all" ? null : v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All provinces" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All provinces</SelectItem>
                      {provinces.map((prov) => (
                        <SelectItem key={prov} value={prov}>
                          {prov}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Growth Trend */}
                <div className="space-y-2">
                  <Label>Growth Trend</Label>
                  <Select
                    value={filters.growthTrend || "all"}
                    onValueChange={(v) =>
                      setFilters({
                        ...filters,
                        growthTrend: v === "all" ? null : (v as any),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All trends" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All trends</SelectItem>
                      <SelectItem value="rising">Rising</SelectItem>
                      <SelectItem value="stable">Stable</SelectItem>
                      <SelectItem value="declining">Declining</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Min Viability */}
                <div className="space-y-2">
                  <Label>Min Viability Score</Label>
                  <Select
                    value={filters.minViability?.toString() || "all"}
                    onValueChange={(v) =>
                      setFilters({
                        ...filters,
                        minViability: v === "all" ? null : parseInt(v),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any score" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any score</SelectItem>
                      <SelectItem value="70">70% or higher</SelectItem>
                      <SelectItem value="80">80% or higher</SelectItem>
                      <SelectItem value="85">85% or higher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-border">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sideHustle"
                    checked={filters.sideHustleOnly}
                    onCheckedChange={(checked) =>
                      setFilters({ ...filters, sideHustleOnly: !!checked })
                    }
                  />
                  <Label htmlFor="sideHustle" className="flex items-center gap-2 cursor-pointer">
                    <Briefcase className="w-4 h-4 text-accent" />
                    Side Hustle Compatible
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newcomer"
                    checked={filters.newcomerFriendlyOnly}
                    onCheckedChange={(checked) =>
                      setFilters({ ...filters, newcomerFriendlyOnly: !!checked })
                    }
                  />
                  <Label htmlFor="newcomer" className="flex items-center gap-2 cursor-pointer">
                    <Globe className="w-4 h-4 text-success" />
                    Newcomer Friendly
                  </Label>
                </div>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="ml-auto text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear filters
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {ideas.length} of {totalCount} ideas
          </p>
        </div>

        {/* Ideas Grid */}
        {ideas.length === 0 ? (
          <Card className="p-12 text-center">
            <Database className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No ideas match your filters</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or clearing filters
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ideas.map((idea) => renderIdeaCard(idea, idea.featured))}
          </div>
        )}

        {/* Bottom CTA */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <div className="text-center">
            <h3 className="font-display text-xl font-bold text-foreground mb-2">
              Want Ideas Personalized to Your Situation?
            </h3>
            <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
              Our AI wizard generates business ideas based on your skills, budget, location,
              and preferences. Get ideas tailored specifically for you.
            </p>
            <Button asChild size="lg" className="btn-gradient gap-2">
              <Link to="/wizard">
                <Sparkles className="w-5 h-5" />
                Start the Wizard
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default IdeaDatabase;
