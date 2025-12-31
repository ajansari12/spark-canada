import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AppHeader } from "@/components/layout/AppHeader";
import {
  Search,
  MapPin,
  Building2,
  Globe,
  Briefcase,
  DollarSign,
  TrendingUp,
  Clock,
  Users,
  ExternalLink,
  Quote,
  Star,
  Sparkles,
} from "lucide-react";
import { useSuccessStories } from "@/hooks/useSuccessStories";
import { SuccessStory } from "@/types/idea";
import { format } from "date-fns";
import { SubmitStoryDialog } from "@/components/success-stories/SubmitStoryDialog";
import { useAuth } from "@/hooks/useAuth";

const PROVINCES = [
  { value: "all", label: "All Provinces" },
  { value: "ON", label: "Ontario" },
  { value: "BC", label: "British Columbia" },
  { value: "AB", label: "Alberta" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "MB", label: "Manitoba" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NB", label: "New Brunswick" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "NL", label: "Newfoundland & Labrador" },
];

export default function SuccessStories() {
  const { user } = useAuth();
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const {
    stories,
    featuredStories,
    stats,
    isLoading,
    filters,
    setFilters,
    industries,
    provinces,
    formatCurrency,
    getStatusBadge,
  } = useSuccessStories();

  const handleFilterChange = (key: keyof typeof filters, value: string | boolean) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      industry: null,
      province: null,
      sideHustleOnly: false,
      newcomerOnly: false,
      search: "",
    });
  };

  const getProvinceLabel = (province: string) => {
    return PROVINCES.find((p) => p.value === province)?.label || province;
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <Star className="w-8 h-8 text-warning" />
              Success Stories
            </h1>
            <p className="text-muted-foreground">
              Real Canadian entrepreneurs who turned their SPARK ideas into thriving businesses.
            </p>
          </div>
          {user && (
            <Button
              onClick={() => setShowSubmitDialog(true)}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Share Your Story
            </Button>
          )}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="pt-4 text-center">
              <div className="text-3xl font-bold text-primary">{stats.totalStories}</div>
              <div className="text-sm text-muted-foreground">Success Stories</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="pt-4 text-center">
              <div className="text-3xl font-bold text-success">
                {formatCurrency(stats.avgMonthlyRevenue)}
              </div>
              <div className="text-sm text-muted-foreground">Avg. Monthly Revenue</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="pt-4 text-center">
              <div className="text-3xl font-bold text-accent">{stats.sideHustlerCount}</div>
              <div className="text-sm text-muted-foreground">Side Hustlers</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="pt-4 text-center">
              <div className="text-3xl font-bold text-blue-500">{stats.newcomerCount}</div>
              <div className="text-sm text-muted-foreground">Newcomers</div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Stories */}
        {featuredStories.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-warning" />
              Featured Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredStories.map((story) => (
                <FeaturedStoryCard
                  key={story.id}
                  story={story}
                  formatCurrency={formatCurrency}
                  getProvinceLabel={getProvinceLabel}
                />
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-8 bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search stories..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-9 bg-background/50"
                />
              </div>

              <Select
                value={filters.province || "all"}
                onValueChange={(v) => handleFilterChange("province", v === "all" ? null : v)}
              >
                <SelectTrigger className="bg-background/50">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Province" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Provinces</SelectItem>
                  {provinces.map((province) => (
                    <SelectItem key={province} value={province}>
                      {getProvinceLabel(province)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.industry || "all"}
                onValueChange={(v) => handleFilterChange("industry", v === "all" ? null : v)}
              >
                <SelectTrigger className="bg-background/50">
                  <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-6 pt-2 border-t border-border/50">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sideHustle"
                  checked={filters.sideHustleOnly}
                  onCheckedChange={(checked) =>
                    handleFilterChange("sideHustleOnly", checked === true)
                  }
                />
                <Label
                  htmlFor="sideHustle"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1.5"
                >
                  <Briefcase className="h-4 w-4 text-accent" />
                  Side Hustlers
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="newcomer"
                  checked={filters.newcomerOnly}
                  onCheckedChange={(checked) =>
                    handleFilterChange("newcomerOnly", checked === true)
                  }
                />
                <Label
                  htmlFor="newcomer"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1.5"
                >
                  <Globe className="h-4 w-4 text-success" />
                  Newcomers to Canada
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          {isLoading ? "Loading..." : `${stories.length} stories found`}
        </div>

        {/* Stories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse bg-card/50">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="h-24 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                formatCurrency={formatCurrency}
                getProvinceLabel={getProvinceLabel}
              />
            ))}
          </div>
        )}

        {stories.length === 0 && !isLoading && (
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-12 text-center">
            <Sparkles className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              No success stories found matching your criteria.
            </p>
            <Button variant="ghost" onClick={clearFilters}>
              Clear Filters
            </Button>
          </Card>
        )}
      </div>

      <SubmitStoryDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog} />
    </div>
  );
}

interface StoryCardProps {
  story: SuccessStory;
  formatCurrency: (value: number | null) => string;
  getProvinceLabel: (province: string) => string;
}

function StoryCard({ story, formatCurrency, getProvinceLabel }: StoryCardProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg leading-tight">{story.title}</CardTitle>
            <CardDescription className="mt-1">
              {story.business_name} • {story.industry}
            </CardDescription>
          </div>
          <div className="flex gap-1">
            {story.is_side_hustle && (
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                <Briefcase className="w-3 h-3 mr-1" />
                Side Hustle
              </Badge>
            )}
            {story.is_newcomer && (
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                <Globe className="w-3 h-3 mr-1" />
                Newcomer
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {story.quote && (
          <div className="bg-muted/50 p-3 rounded-lg border-l-2 border-primary">
            <Quote className="w-4 h-4 text-primary mb-1" />
            <p className="text-sm italic text-foreground">"{story.quote}"</p>
            <p className="text-xs text-muted-foreground mt-1">
              — {story.is_anonymous ? "Anonymous" : story.display_name || "SPARK User"}
            </p>
          </div>
        )}

        <p className="text-sm text-muted-foreground line-clamp-3">{story.story}</p>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>
              {story.city ? `${story.city}, ` : ""}
              {getProvinceLabel(story.province)}
            </span>
          </div>
          {story.startup_cost && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>Started with {formatCurrency(story.startup_cost)}</span>
            </div>
          )}
          {story.monthly_revenue && (
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-success font-medium">
                {formatCurrency(story.monthly_revenue)}/mo
              </span>
            </div>
          )}
          {story.time_to_first_sale && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>First sale: {story.time_to_first_sale}</span>
            </div>
          )}
          {story.employees_count > 1 && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{story.employees_count} employees</span>
            </div>
          )}
        </div>

        {story.ai_tools_used && story.ai_tools_used.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2">
            <span className="text-xs text-muted-foreground">AI Tools:</span>
            {story.ai_tools_used.map((tool) => (
              <Badge key={tool} variant="secondary" className="text-xs">
                {tool}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-xs text-muted-foreground">
            {format(new Date(story.created_at), "MMMM yyyy")}
          </span>
          {story.website_url && (
            <Button variant="ghost" size="sm" asChild className="gap-1 text-xs">
              <a href={story.website_url} target="_blank" rel="noopener noreferrer">
                Visit Website <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function FeaturedStoryCard({ story, formatCurrency, getProvinceLabel }: StoryCardProps) {
  return (
    <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30 hover:border-primary/50 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-warning fill-warning" />
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-xs">
            Featured
          </Badge>
        </div>
        <CardTitle className="text-lg leading-tight">{story.business_name}</CardTitle>
        <CardDescription>
          {story.industry} • {getProvinceLabel(story.province)}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {story.quote && (
          <p className="text-sm italic text-foreground">"{story.quote}"</p>
        )}

        <div className="flex items-center gap-4">
          {story.monthly_revenue && (
            <div className="text-center">
              <div className="text-xl font-bold text-success">
                {formatCurrency(story.monthly_revenue)}
              </div>
              <div className="text-xs text-muted-foreground">Monthly</div>
            </div>
          )}
          {story.time_to_first_sale && (
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {story.time_to_first_sale}
              </div>
              <div className="text-xs text-muted-foreground">To First Sale</div>
            </div>
          )}
        </div>

        <div className="flex gap-1">
          {story.is_side_hustle && (
            <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/20">
              Side Hustle
            </Badge>
          )}
          {story.is_newcomer && (
            <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
              Newcomer
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
