import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AppHeader } from "@/components/layout/AppHeader";
import { ExternalLink, Search, DollarSign, MapPin, Building2, Filter, Globe, Briefcase, Clock, Star } from "lucide-react";
import { useGrants, Grant } from "@/hooks/useGrants";

const PROVINCES = [
  { value: "all", label: "All Provinces" },
  { value: "federal", label: "Federal (Canada-wide)" },
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

const INDUSTRIES = [
  { value: "all", label: "All Industries" },
  { value: "technology", label: "Technology" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "retail", label: "Retail" },
  { value: "services", label: "Services" },
  { value: "food_beverage", label: "Food & Beverage" },
  { value: "clean_tech", label: "Clean Tech" },
  { value: "life_sciences", label: "Life Sciences" },
  { value: "energy", label: "Energy" },
  { value: "agriculture", label: "Agriculture" },
];

const GRANT_TYPES = [
  { value: "all", label: "All Types" },
  { value: "grant", label: "Grants" },
  { value: "loan", label: "Loans" },
  { value: "tax_credit", label: "Tax Credits" },
];

export default function Grants() {
  const [search, setSearch] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [newcomerOnly, setNewcomerOnly] = useState(false);
  const [sideHustleOnly, setSideHustleOnly] = useState(false);
  const [youthOnly, setYouthOnly] = useState(false);

  const { grants, isLoading } = useGrants();

  const filteredGrants = grants?.filter((grant) => {
    const matchesSearch =
      grant.name.toLowerCase().includes(search.toLowerCase()) ||
      grant.description.toLowerCase().includes(search.toLowerCase());

    const matchesProvince =
      provinceFilter === "all" ||
      (provinceFilter === "federal" && grant.province === null) ||
      grant.province === provinceFilter;

    const matchesIndustry =
      industryFilter === "all" ||
      grant.industries.includes(industryFilter) ||
      grant.industries.includes("all");

    const matchesType =
      typeFilter === "all" ||
      grant.grant_type === typeFilter;

    // 2026 Enhanced Filters
    const matchesNewcomer = !newcomerOnly || grant.newcomer_eligible === true;
    const matchesSideHustle = !sideHustleOnly || grant.side_hustle_eligible !== false;
    const matchesYouth = !youthOnly || grant.age_restrictions?.includes("39") || grant.name.toLowerCase().includes("youth");

    return matchesSearch && matchesProvince && matchesIndustry && matchesType &&
           matchesNewcomer && matchesSideHustle && matchesYouth;
  });

  const formatFunding = (min: number | null, max: number | null) => {
    if (!min && !max) return "Varies";
    if (!max) return `Up to $${min?.toLocaleString()}+`;
    if (!min || min === 0) return `Up to $${max.toLocaleString()}`;
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "grant": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "loan": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "tax_credit": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getProvinceLabel = (province: string | null) => {
    if (!province) return "Federal";
    return PROVINCES.find(p => p.value === province)?.label || province;
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Canadian Business Grants & Funding</h1>
          <p className="text-muted-foreground">
            Discover grants, loans, and tax credits available for your business across Canada.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search grants..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-background/50"
                />
              </div>

              <Select value={provinceFilter} onValueChange={setProvinceFilter}>
                <SelectTrigger className="bg-background/50">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Province" />
                </SelectTrigger>
                <SelectContent>
                  {PROVINCES.map((province) => (
                    <SelectItem key={province.value} value={province.value}>
                      {province.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="bg-background/50">
                  <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((industry) => (
                    <SelectItem key={industry.value} value={industry.value}>
                      {industry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-background/50">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {GRANT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 2026 Enhanced Filters */}
            <div className="flex flex-wrap gap-6 pt-2 border-t border-border/50">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="newcomer"
                  checked={newcomerOnly}
                  onCheckedChange={(checked) => setNewcomerOnly(checked === true)}
                />
                <Label
                  htmlFor="newcomer"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1.5"
                >
                  <Globe className="h-4 w-4 text-success" />
                  Newcomer Friendly
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sideHustle"
                  checked={sideHustleOnly}
                  onCheckedChange={(checked) => setSideHustleOnly(checked === true)}
                />
                <Label
                  htmlFor="sideHustle"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1.5"
                >
                  <Briefcase className="h-4 w-4 text-accent" />
                  Side Hustle OK
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="youth"
                  checked={youthOnly}
                  onCheckedChange={(checked) => setYouthOnly(checked === true)}
                />
                <Label
                  htmlFor="youth"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1.5"
                >
                  <Star className="h-4 w-4 text-warning" />
                  Youth (Under 40)
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          {isLoading ? "Loading..." : `${filteredGrants?.length || 0} funding opportunities found`}
        </div>

        {/* Grants Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse bg-card/50">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGrants?.map((grant) => (
              <Card 
                key={grant.id} 
                className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 flex flex-col"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg leading-tight">{grant.name}</CardTitle>
                    <Badge variant="outline" className={getTypeColor(grant.grant_type)}>
                      {grant.grant_type === "tax_credit" ? "Tax Credit" : 
                       grant.grant_type.charAt(0).toUpperCase() + grant.grant_type.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <MapPin className="h-3 w-3" />
                    {getProvinceLabel(grant.province)}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                    {grant.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="font-medium">
                        {formatFunding(grant.funding_min, grant.funding_max)}
                      </span>
                    </div>
                    
                    {grant.eligibility && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        <span className="font-medium">Eligibility:</span> {grant.eligibility}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-1">
                      {grant.industries.slice(0, 3).map((industry) => (
                        <Badge key={industry} variant="secondary" className="text-xs">
                          {industry === "all" ? "All Industries" : 
                           industry.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      ))}
                      {grant.industries.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{grant.industries.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2"
                      asChild
                    >
                      <a href={grant.url} target="_blank" rel="noopener noreferrer">
                        Learn More <ExternalLink className="h-3 w-3 ml-2" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredGrants?.length === 0 && !isLoading && (
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-12 text-center">
            <p className="text-muted-foreground">No grants found matching your criteria.</p>
            <Button
              variant="ghost"
              className="mt-4"
              onClick={() => {
                setSearch("");
                setProvinceFilter("all");
                setIndustryFilter("all");
                setTypeFilter("all");
                setNewcomerOnly(false);
                setSideHustleOnly(false);
                setYouthOnly(false);
              }}
            >
              Clear Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
