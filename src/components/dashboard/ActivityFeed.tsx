import { ActivityItem } from "@/hooks/useDashboardStats";
import { cn } from "@/lib/utils";
import { Lightbulb, CheckCircle2, PlayCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityFeedProps {
  activity: ActivityItem[];
  isLoading: boolean;
}

export const ActivityFeed = ({ activity, isLoading }: ActivityFeedProps) => {
  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "idea_saved":
        return Lightbulb;
      case "session_completed":
        return CheckCircle2;
      case "wizard_started":
        return PlayCircle;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "idea_saved":
        return "bg-success/10 text-success";
      case "session_completed":
        return "bg-primary/10 text-primary";
      case "wizard_started":
        return "bg-accent/10 text-accent";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-foreground">Recent Activity</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-3 w-40 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activity.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-foreground">Recent Activity</h2>
        <div className="bg-muted/30 rounded-xl border border-dashed border-border p-6 text-center">
          <Clock className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No activity yet. Start the wizard to begin!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-semibold text-foreground">Recent Activity</h2>
      <div className="space-y-2">
        {activity.map((item, index) => {
          const Icon = getActivityIcon(item.type);
          return (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-muted/50",
                index === 0 && "bg-muted/30"
              )}
            >
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", getActivityColor(item.type))}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground truncate">{item.description}</p>
              </div>
              <div className="text-xs text-muted-foreground flex-shrink-0">
                {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
