import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { BusinessIdea, IdeaFilters, SortOption } from "@/types/idea";

export const useIdeas = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<IdeaFilters>({
    search: "",
    industry: null,
    viabilityRange: [0, 100],
    budgetRange: [0, 100000],
    // 2026 Enhanced Filters
    sideHustleOnly: false,
    newcomerFriendlyOnly: false,
    minRecessionResistance: null,
    minPainPointSeverity: null,
  });

  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Fetch ideas
  const { data: ideas = [], isLoading, error } = useQuery({
    queryKey: ["ideas", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("ideas")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_saved", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data || []).map((idea) => ({
        ...idea,
        quick_wins: Array.isArray(idea.quick_wins) ? idea.quick_wins : [],
        competitors: Array.isArray(idea.competitors) ? idea.competitors : [],
        grants: Array.isArray(idea.grants) ? idea.grants : [],
        action_plan: idea.action_plan as unknown as BusinessIdea['action_plan'],
      })) as unknown as BusinessIdea[];
    },
    enabled: !!user,
  });

  // Get unique industries
  const industries = useMemo(() => {
    const uniqueIndustries = [...new Set(ideas.map((i) => i.industry).filter(Boolean))];
    return uniqueIndustries.sort();
  }, [ideas]);

  // Filter and sort ideas
  const filteredIdeas = useMemo(() => {
    let result = [...ideas];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (idea) =>
          idea.name.toLowerCase().includes(searchLower) ||
          idea.description.toLowerCase().includes(searchLower)
      );
    }

    // Industry filter
    if (filters.industry) {
      result = result.filter((idea) => idea.industry === filters.industry);
    }

    // Viability filter
    result = result.filter((idea) => {
      const score = idea.viability_score ?? 0;
      return score >= filters.viabilityRange[0] && score <= filters.viabilityRange[1];
    });

    // Budget filter
    result = result.filter((idea) => {
      const cost = idea.startup_cost_min ?? 0;
      return cost >= filters.budgetRange[0] && cost <= filters.budgetRange[1];
    });

    // 2026 Enhanced Filters
    // Side hustle compatible filter
    if (filters.sideHustleOnly) {
      result = result.filter((idea) => idea.side_hustle_compatible === true);
    }

    // Newcomer friendly filter
    if (filters.newcomerFriendlyOnly) {
      result = result.filter((idea) => idea.newcomer_friendly === true);
    }

    // Recession resistance filter
    if (filters.minRecessionResistance !== null) {
      result = result.filter((idea) => {
        const score = idea.recession_resistance_score ?? 0;
        return score >= filters.minRecessionResistance!;
      });
    }

    // Pain point severity filter
    if (filters.minPainPointSeverity !== null) {
      result = result.filter((idea) => {
        const severity = idea.pain_point_severity ?? 0;
        return severity >= filters.minPainPointSeverity!;
      });
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "score-high":
        result.sort((a, b) => (b.viability_score ?? 0) - (a.viability_score ?? 0));
        break;
      case "score-low":
        result.sort((a, b) => (a.viability_score ?? 0) - (b.viability_score ?? 0));
        break;
      case "cost-low":
        result.sort((a, b) => (a.startup_cost_min ?? 0) - (b.startup_cost_min ?? 0));
        break;
      case "cost-high":
        result.sort((a, b) => (b.startup_cost_min ?? 0) - (a.startup_cost_min ?? 0));
        break;
    }

    return result;
  }, [ideas, filters, sortBy]);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (ideaIds: string[]) => {
      const { error } = await supabase
        .from("ideas")
        .delete()
        .in("id", ideaIds);

      if (error) throw error;
    },
    onSuccess: (_, ideaIds) => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      toast({
        title: "Ideas Deleted",
        description: `${ideaIds.length} idea${ideaIds.length > 1 ? "s" : ""} deleted successfully.`,
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: "Failed to delete ideas. Please try again.",
      });
    },
  });

  return {
    ideas: filteredIdeas,
    allIdeas: ideas,
    isLoading,
    error,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    industries,
    deleteIdeas: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
