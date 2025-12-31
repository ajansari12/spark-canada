import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface DashboardStats {
  totalIdeas: number;
  savedIdeas: number;
  completedSessions: number;
  documentsCount: number;
}

export interface RecentIdea {
  id: string;
  name: string;
  description: string;
  industry: string | null;
  viability_score: number | null;
  created_at: string;
}

export interface ActivityItem {
  id: string;
  type: "idea_saved" | "session_completed" | "wizard_started";
  title: string;
  description: string;
  timestamp: string;
}

export const useDashboardStats = () => {
  const { user } = useAuth();

  // Fetch stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats", user?.id],
    queryFn: async (): Promise<DashboardStats> => {
      if (!user) return { totalIdeas: 0, savedIdeas: 0, completedSessions: 0, documentsCount: 0 };

      // Fetch saved ideas count
      const { count: savedIdeasCount } = await supabase
        .from("ideas")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_saved", true);

      // Fetch total ideas (including unsaved)
      const { count: totalIdeasCount } = await supabase
        .from("ideas")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // Fetch completed sessions
      const { count: completedSessionsCount } = await supabase
        .from("sessions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "completed");

      return {
        totalIdeas: totalIdeasCount ?? 0,
        savedIdeas: savedIdeasCount ?? 0,
        completedSessions: completedSessionsCount ?? 0,
        documentsCount: 0, // Documents table doesn't exist yet
      };
    },
    enabled: !!user,
  });

  // Fetch recent ideas
  const { data: recentIdeas = [], isLoading: ideasLoading } = useQuery({
    queryKey: ["recent-ideas", user?.id],
    queryFn: async (): Promise<RecentIdea[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("ideas")
        .select("id, name, description, industry, viability_score, created_at")
        .eq("user_id", user.id)
        .eq("is_saved", true)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Fetch activity feed (combine ideas and sessions)
  const { data: activity = [], isLoading: activityLoading } = useQuery({
    queryKey: ["activity-feed", user?.id],
    queryFn: async (): Promise<ActivityItem[]> => {
      if (!user) return [];

      // Fetch recent ideas
      const { data: ideas } = await supabase
        .from("ideas")
        .select("id, name, created_at")
        .eq("user_id", user.id)
        .eq("is_saved", true)
        .order("created_at", { ascending: false })
        .limit(5);

      // Fetch recent sessions
      const { data: sessions } = await supabase
        .from("sessions")
        .select("id, status, created_at, completed_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      const activityItems: ActivityItem[] = [];

      // Add ideas to activity
      (ideas || []).forEach((idea) => {
        activityItems.push({
          id: `idea-${idea.id}`,
          type: "idea_saved",
          title: "Idea Saved",
          description: idea.name,
          timestamp: idea.created_at,
        });
      });

      // Add sessions to activity
      (sessions || []).forEach((session) => {
        if (session.status === "completed" && session.completed_at) {
          activityItems.push({
            id: `session-completed-${session.id}`,
            type: "session_completed",
            title: "Wizard Completed",
            description: "Generated new business ideas",
            timestamp: session.completed_at,
          });
        } else {
          activityItems.push({
            id: `session-started-${session.id}`,
            type: "wizard_started",
            title: "Wizard Started",
            description: "Started exploring business ideas",
            timestamp: session.created_at,
          });
        }
      });

      // Sort by timestamp and take latest 10
      return activityItems
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);
    },
    enabled: !!user,
  });

  return {
    stats: stats ?? { totalIdeas: 0, savedIdeas: 0, completedSessions: 0, documentsCount: 0 },
    recentIdeas,
    activity,
    isLoading: statsLoading || ideasLoading || activityLoading,
  };
};
