import { useState, useEffect, useCallback, useMemo } from "react";
import { usePreValidatedIdeas } from "./usePreValidatedIdeas";
import { IdeaOfTheWeek, getCurrentWeekDates } from "@/types/ideaOfWeek";
import { PreValidatedIdea } from "@/types/prevalidated";

// Since we don't have a database table yet, we'll generate the idea of the week
// from the pre-validated ideas based on the current week number
function getWeekNumber(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  const oneWeek = 604800000; // milliseconds in a week
  return Math.floor(diff / oneWeek);
}

// Curated weekly ideas with special headlines and highlights
const weeklyHighlights: Record<number, {
  headline: string;
  highlight_points: string[];
  why_now: string;
}> = {
  0: {
    headline: "Start 2026 Strong: Low-Risk, High Reward",
    highlight_points: [
      "Perfect for January goal-setters",
      "Minimal upfront investment required",
      "Can launch within 30 days",
    ],
    why_now: "New Year is the best time for new beginnings. This business aligns with 2026 economic trends.",
  },
  1: {
    headline: "Side Hustle Gold: Work From Home",
    highlight_points: [
      "10-15 hours per week is all you need",
      "No office or retail space required",
      "Scale at your own pace",
    ],
    why_now: "Remote work is here to stay. This business capitalizes on the work-from-home economy.",
  },
  2: {
    headline: "Recession-Proof Pick of the Week",
    highlight_points: [
      "Essential service that people need regardless of economy",
      "90%+ recession resistance score",
      "Steady demand year-round",
    ],
    why_now: "With economic uncertainty, focus on businesses people can't cut from their budgets.",
  },
  3: {
    headline: "Newcomer-Friendly Opportunity",
    highlight_points: [
      "No Canadian credentials required",
      "Language skills are an advantage, not a barrier",
      "Strong newcomer community support",
    ],
    why_now: "Canada welcomes 500K+ immigrants yearly. Build a business that serves this growing community.",
  },
  4: {
    headline: "Tech-Enabled, Human-Powered",
    highlight_points: [
      "Use AI tools to multiply your productivity",
      "Personal touch is your competitive advantage",
      "Low technical barrier to entry",
    ],
    why_now: "AI tools have leveled the playing field. Small businesses can now compete with the big players.",
  },
};

export const useIdeaOfTheWeek = () => {
  const { ideas: preValidatedIdeas, isLoading } = usePreValidatedIdeas();
  const [ideaOfWeek, setIdeaOfWeek] = useState<IdeaOfTheWeek | null>(null);
  const [clickCounts, setClickCounts] = useState({ wizard: 0, grants: 0 });

  // Get current week dates
  const { weekStart, weekEnd } = useMemo(() => getCurrentWeekDates(), []);

  // Select idea based on week number (rotate through featured ideas first, then all)
  useEffect(() => {
    if (preValidatedIdeas.length === 0) return;

    const weekNum = getWeekNumber(new Date());
    const highlightIndex = weekNum % Object.keys(weeklyHighlights).length;
    const highlights = weeklyHighlights[highlightIndex];

    // Prioritize featured ideas, then rotate through all
    const featuredIdeas = preValidatedIdeas.filter(i => i.featured);
    const ideasPool = featuredIdeas.length > 0 ? featuredIdeas : preValidatedIdeas;
    const selectedIdea = ideasPool[weekNum % ideasPool.length];

    if (selectedIdea) {
      setIdeaOfWeek({
        id: `iotw-${weekStart}`,
        pre_validated_idea_id: selectedIdea.id,
        pre_validated_idea: selectedIdea,
        idea_name: selectedIdea.name,
        idea_description: selectedIdea.description,
        industry: selectedIdea.industry,
        headline: highlights.headline,
        highlight_points: highlights.highlight_points,
        why_now: highlights.why_now,
        viability_score: selectedIdea.viabilityScore,
        recession_resistance: selectedIdea.recessionResistanceScore,
        pain_point_severity: selectedIdea.painPointSeverity,
        week_start: weekStart,
        week_end: weekEnd,
        is_active: true,
        views: 0,
        clicks_to_wizard: clickCounts.wizard,
        clicks_to_grants: clickCounts.grants,
        created_at: new Date().toISOString(),
      });
    }
  }, [preValidatedIdeas, weekStart, weekEnd, clickCounts]);

  // Track clicks (in a real implementation, this would call an API)
  const trackClick = useCallback((action: 'wizard' | 'grants' | 'details') => {
    if (action === 'wizard') {
      setClickCounts(prev => ({ ...prev, wizard: prev.wizard + 1 }));
    } else if (action === 'grants') {
      setClickCounts(prev => ({ ...prev, grants: prev.grants + 1 }));
    }
    // In a real implementation:
    // await supabase.rpc('increment_idea_of_week_click', { idea_id, click_type: action });
  }, []);

  // Get the underlying pre-validated idea with full details
  const getFullIdea = useCallback((): PreValidatedIdea | null => {
    return ideaOfWeek?.pre_validated_idea || null;
  }, [ideaOfWeek]);

  return {
    ideaOfWeek,
    isLoading,
    trackClick,
    getFullIdea,
    weekStart,
    weekEnd,
  };
};
