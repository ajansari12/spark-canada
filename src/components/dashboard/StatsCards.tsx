import { DashboardStats } from "@/hooks/useDashboardStats";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Lightbulb, Bookmark, FileText, CheckCircle2 } from "lucide-react";

interface StatsCardsProps {
  stats: DashboardStats;
  isLoading: boolean;
}

export const StatsCards = ({ stats, isLoading }: StatsCardsProps) => {
  const statItems = [
    {
      label: "Ideas Generated",
      value: stats.totalIdeas,
      icon: Lightbulb,
      color: "primary",
      href: "/app/ideas",
    },
    {
      label: "Saved Ideas",
      value: stats.savedIdeas,
      icon: Bookmark,
      color: "success",
      href: "/app/ideas",
    },
    {
      label: "Documents",
      value: stats.documentsCount,
      icon: FileText,
      color: "accent",
      href: "/app/documents",
    },
    {
      label: "Completed Sessions",
      value: stats.completedSessions,
      icon: CheckCircle2,
      color: "warning",
      href: "#",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-4 animate-pulse">
            <div className="h-8 w-12 bg-muted rounded mb-2" />
            <div className="h-4 w-24 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((stat) => {
        const Icon = stat.icon;
        const Wrapper = stat.href !== "#" ? Link : "div";
        const wrapperProps = stat.href !== "#" ? { to: stat.href } : {};

        return (
          <Wrapper
            key={stat.label}
            {...(wrapperProps as any)}
            className={cn(
              "bg-card rounded-xl border border-border p-4 transition-all",
              stat.href !== "#" && "hover:border-primary/30 cursor-pointer card-warm"
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div
                className={cn(
                  "font-display text-3xl font-bold",
                  stat.color === "primary" && "text-primary",
                  stat.color === "success" && "text-success",
                  stat.color === "accent" && "text-accent",
                  stat.color === "warning" && "text-warning"
                )}
              >
                {stat.value}
              </div>
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  stat.color === "primary" && "bg-primary/10 text-primary",
                  stat.color === "success" && "bg-success/10 text-success",
                  stat.color === "accent" && "bg-accent/10 text-accent",
                  stat.color === "warning" && "bg-warning/10 text-warning"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </Wrapper>
        );
      })}
    </div>
  );
};
