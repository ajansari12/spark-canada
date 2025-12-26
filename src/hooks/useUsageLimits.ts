import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

const FREE_GENERATION_LIMIT = 3;

interface UsageData {
  idea_generation_count: number;
  generation_reset_date: string | null;
  canGenerate: boolean;
  remaining: number;
}

export const useUsageLimits = () => {
  const { user, session } = useAuth();
  const [usage, setUsage] = useState<UsageData>({
    idea_generation_count: 0,
    generation_reset_date: null,
    canGenerate: true,
    remaining: FREE_GENERATION_LIMIT,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsage = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("idea_generation_count, generation_reset_date")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      // Check if we need to reset (more than 30 days)
      const resetDate = data.generation_reset_date
        ? new Date(data.generation_reset_date)
        : new Date();
      const now = new Date();
      const daysSinceReset = Math.floor(
        (now.getTime() - resetDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      let count = data.idea_generation_count || 0;
      if (daysSinceReset >= 30) {
        count = 0;
        // Update the reset date
        await supabase
          .from("profiles")
          .update({
            idea_generation_count: 0,
            generation_reset_date: now.toISOString(),
          })
          .eq("id", user.id);
      }

      const remaining = Math.max(0, FREE_GENERATION_LIMIT - count);
      setUsage({
        idea_generation_count: count,
        generation_reset_date: data.generation_reset_date,
        canGenerate: remaining > 0,
        remaining,
      });
    } catch (error) {
      console.error("Error fetching usage:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const incrementUsage = useCallback(async () => {
    if (!user) return false;

    try {
      const newCount = usage.idea_generation_count + 1;
      const { error } = await supabase
        .from("profiles")
        .update({
          idea_generation_count: newCount,
          generation_reset_date:
            usage.generation_reset_date || new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      const remaining = Math.max(0, FREE_GENERATION_LIMIT - newCount);
      setUsage((prev) => ({
        ...prev,
        idea_generation_count: newCount,
        canGenerate: remaining > 0,
        remaining,
      }));

      return true;
    } catch (error) {
      console.error("Error incrementing usage:", error);
      return false;
    }
  }, [user, usage]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  return {
    usage,
    isLoading,
    incrementUsage,
    refreshUsage: fetchUsage,
    FREE_GENERATION_LIMIT,
  };
};
