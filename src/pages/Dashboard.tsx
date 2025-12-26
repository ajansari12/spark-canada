import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Button } from "@/components/ui/button";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentIdeasCarousel } from "@/components/dashboard/RecentIdeasCarousel";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import {
  Sparkles,
  LogOut,
  Lightbulb,
  FileText,
  TrendingUp,
  Settings,
  Plus,
  ChevronRight,
} from "lucide-react";

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { stats, recentIdeas, activity, isLoading: statsLoading } = useDashboardStats();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-warm flex items-center justify-center animate-pulse">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const quickActions = [
    {
      icon: Plus,
      label: "Start New Wizard",
      description: "Generate personalized business ideas",
      href: "/wizard",
      color: "primary",
    },
    {
      icon: Lightbulb,
      label: "My Ideas",
      description: "View your saved business ideas",
      href: "/app/ideas",
      color: "success",
    },
    {
      icon: FileText,
      label: "Documents",
      description: "Access generated business plans",
      href: "/app/documents",
      color: "accent",
    },
    {
      icon: TrendingUp,
      label: "Market Trends",
      description: "Explore trending opportunities",
      href: "/app/trends",
      color: "warning",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-warm flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">SPARK</span>
            </Link>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/app/settings">
                  <Settings className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" onClick={handleSignOut} className="gap-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Welcome back! 👋</h1>
          <p className="text-muted-foreground">Ready to discover your next big business idea?</p>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <StatsCards stats={stats} isLoading={statsLoading} />
        </div>

        {/* Recent Ideas Carousel */}
        <div className="mb-8">
          <RecentIdeasCarousel ideas={recentIdeas} isLoading={statsLoading} />
        </div>

        {/* Two Column Layout: Quick Actions + Activity Feed */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.href}
                  className="group bg-card rounded-xl border border-border p-5 hover:border-primary/30 transition-all duration-300 card-warm"
                >
                  <div
                    className={`
                    w-12 h-12 rounded-xl flex items-center justify-center mb-4
                    ${action.color === "primary" ? "bg-primary/10 text-primary" : ""}
                    ${action.color === "success" ? "bg-success/10 text-success" : ""}
                    ${action.color === "accent" ? "bg-accent/10 text-accent" : ""}
                    ${action.color === "warning" ? "bg-warning/10 text-warning" : ""}
                    group-hover:scale-110 transition-transform
                  `}
                  >
                    <action.icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{action.label}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>

            {/* CTA Section */}
            <div className="mt-8 bg-gradient-to-r from-primary/10 via-accent/10 to-success/10 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-warm flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Ready to Find Your Perfect Business?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Complete our quick wizard to get personalized AI-powered business recommendations
                tailored to you.
              </p>
              <Button className="btn-gradient rounded-full px-8 py-6 text-lg" asChild>
                <Link to="/wizard">Start the Wizard</Link>
              </Button>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-1">
            <ActivityFeed activity={activity} isLoading={statsLoading} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;