import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppHeader } from "@/components/layout/AppHeader";
import { TrendingUp, TrendingDown, Minus, MapPin, Calendar, Lightbulb, BarChart3 } from "lucide-react";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

const PROVINCES = [
  { value: "all", label: "All Canada" },
  { value: "ON", label: "Ontario" },
  { value: "BC", label: "British Columbia" },
  { value: "AB", label: "Alberta" },
  { value: "QC", label: "Quebec" },
];

// Mock data for trends - in production this would come from an API
const industryGrowthData = [
  { industry: "Tech & AI", growth: 24, score: 92 },
  { industry: "E-commerce", growth: 18, score: 88 },
  { industry: "Healthcare", growth: 15, score: 85 },
  { industry: "Clean Energy", growth: 22, score: 90 },
  { industry: "Food & Bev", growth: 8, score: 75 },
  { industry: "Real Estate", growth: -3, score: 62 },
  { industry: "Retail", growth: 5, score: 68 },
  { industry: "Manufacturing", growth: 7, score: 72 },
];

const seasonalData = [
  { month: "Jan", retail: 45, services: 60, tech: 80 },
  { month: "Feb", retail: 40, services: 65, tech: 82 },
  { month: "Mar", retail: 55, services: 70, tech: 85 },
  { month: "Apr", retail: 60, services: 72, tech: 83 },
  { month: "May", retail: 65, services: 75, tech: 84 },
  { month: "Jun", retail: 70, services: 78, tech: 86 },
  { month: "Jul", retail: 80, services: 82, tech: 85 },
  { month: "Aug", retail: 85, services: 80, tech: 84 },
  { month: "Sep", retail: 75, services: 78, tech: 88 },
  { month: "Oct", retail: 70, services: 75, tech: 90 },
  { month: "Nov", retail: 90, services: 72, tech: 92 },
  { month: "Dec", retail: 100, services: 68, tech: 88 },
];

const businessTypeData = [
  { name: "Online Business", value: 35, color: "hsl(var(--primary))" },
  { name: "Hybrid", value: 30, color: "hsl(var(--chart-2))" },
  { name: "Brick & Mortar", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Service-based", value: 15, color: "hsl(var(--chart-4))" },
];

const trendingOpportunities = [
  {
    title: "AI-Powered Services",
    description: "Businesses integrating AI tools for customer service, content creation, and automation are seeing 3x faster growth.",
    trend: "up",
    growth: "+45%",
    category: "Technology",
  },
  {
    title: "Sustainable Products",
    description: "Eco-friendly and sustainable product lines are outperforming traditional alternatives in consumer preference.",
    trend: "up",
    growth: "+28%",
    category: "Retail",
  },
  {
    title: "Remote Work Solutions",
    description: "Tools and services supporting remote/hybrid work continue to show strong demand post-pandemic.",
    trend: "up",
    growth: "+22%",
    category: "Services",
  },
  {
    title: "Local Food Production",
    description: "Farm-to-table and local food production businesses are gaining market share in urban areas.",
    trend: "up",
    growth: "+18%",
    category: "Food & Beverage",
  },
  {
    title: "Traditional Retail",
    description: "Pure brick-and-mortar retail without online presence continues to face challenges.",
    trend: "down",
    growth: "-12%",
    category: "Retail",
  },
];

const seasonalOpportunities = [
  { season: "Winter (Dec-Feb)", opportunities: ["Holiday retail", "Tax preparation services", "Indoor fitness", "Home renovation planning"] },
  { season: "Spring (Mar-May)", opportunities: ["Landscaping & gardening", "Moving services", "Wedding industry", "Outdoor equipment"] },
  { season: "Summer (Jun-Aug)", opportunities: ["Tourism & hospitality", "Outdoor recreation", "Food trucks & festivals", "Summer camps"] },
  { season: "Fall (Sep-Nov)", opportunities: ["Back-to-school retail", "Home heating services", "Halloween & Thanksgiving", "Year-end consulting"] },
];

export default function Trends() {
  const [selectedProvince, setSelectedProvince] = useState("all");

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down": return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 15) return "hsl(var(--chart-1))";
    if (growth > 5) return "hsl(var(--chart-2))";
    if (growth > 0) return "hsl(var(--chart-3))";
    return "hsl(var(--destructive))";
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Market Trends Dashboard</h1>
            <p className="text-muted-foreground">
              Discover trending industries, seasonal opportunities, and market insights for Canadian businesses.
            </p>
          </div>
          <Select value={selectedProvince} onValueChange={setSelectedProvince}>
            <SelectTrigger className="w-48 bg-card/50">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Select Province" />
            </SelectTrigger>
            <SelectContent>
              {PROVINCES.map((province) => (
                <SelectItem key={province.value} value={province.value}>
                  {province.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Industry Growth Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Industry Growth Rates
              </CardTitle>
              <CardDescription>Year-over-year growth by industry sector</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={industryGrowthData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tickFormatter={(v) => `${v}%`} stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="industry" type="category" width={100} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, "Growth"]}
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Bar 
                      dataKey="growth" 
                      radius={[0, 4, 4, 0]}
                      fill="hsl(var(--primary))"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Business Model Distribution
              </CardTitle>
              <CardDescription>New business registrations by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={businessTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={false}
                    >
                      {businessTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, "Share"]}
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seasonal Trends Chart */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Seasonal Business Performance
            </CardTitle>
            <CardDescription>Monthly performance index by sector (100 = peak performance)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={seasonalData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="retail" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Retail" />
                  <Line type="monotone" dataKey="services" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} name="Services" />
                  <Line type="monotone" dataKey="tech" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} name="Technology" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Trending Opportunities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Trending Opportunities
              </CardTitle>
              <CardDescription>Hot business opportunities based on market data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {trendingOpportunities.map((opp, index) => (
                <div 
                  key={index} 
                  className="p-4 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {getTrendIcon(opp.trend)}
                      <h4 className="font-medium">{opp.title}</h4>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={opp.trend === "up" ? "text-green-500 border-green-500/30" : "text-red-500 border-red-500/30"}
                    >
                      {opp.growth}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{opp.description}</p>
                  <Badge variant="secondary" className="text-xs">{opp.category}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Seasonal Opportunities
              </CardTitle>
              <CardDescription>Best business opportunities by season</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {seasonalOpportunities.map((season, index) => (
                <div 
                  key={index} 
                  className="p-4 rounded-lg bg-background/50 border border-border/50"
                >
                  <h4 className="font-medium mb-3">{season.season}</h4>
                  <div className="flex flex-wrap gap-2">
                    {season.opportunities.map((opp, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {opp}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Key Insights */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Key Market Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="text-4xl font-bold text-primary mb-2">35%</div>
                <p className="text-sm text-muted-foreground">of new businesses are purely online</p>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl font-bold text-primary mb-2">$15K</div>
                <p className="text-sm text-muted-foreground">average startup cost in 2024</p>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl font-bold text-primary mb-2">78%</div>
                <p className="text-sm text-muted-foreground">of successful startups use digital marketing</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
