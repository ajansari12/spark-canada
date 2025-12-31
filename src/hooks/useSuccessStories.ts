import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { SuccessStory, SuccessStoryFilters } from "@/types/idea";

interface SubmitStoryData {
  title: string;
  story: string;
  quote?: string;
  business_name: string;
  industry: string;
  province: string;
  city?: string;
  startup_cost?: number;
  monthly_revenue?: number;
  time_to_first_sale?: string;
  employees_count?: number;
  is_side_hustle?: boolean;
  is_newcomer?: boolean;
  ai_tools_used?: string[];
  idea_id?: string;
  spark_helped?: boolean;
  photo_url?: string;
  business_photo_url?: string;
  website_url?: string;
  display_name?: string;
  is_anonymous?: boolean;
}

export const useSuccessStories = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<SuccessStoryFilters>({
    industry: null,
    province: null,
    sideHustleOnly: false,
    newcomerOnly: false,
    search: "",
  });

  // Fetch all approved/featured stories (public)
  const { data: stories = [], isLoading, error } = useQuery({
    queryKey: ["success-stories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("success_stories")
        .select("*")
        .in("status", ["approved", "featured"])
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data || []) as SuccessStory[];
    },
  });

  // Fetch user's own stories (including pending)
  const { data: myStories = [], isLoading: isLoadingMyStories } = useQuery({
    queryKey: ["my-success-stories", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("success_stories")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data || []) as SuccessStory[];
    },
    enabled: !!user,
  });

  // Get featured stories for landing page
  const featuredStories = useMemo(() => {
    return stories.filter((s) => s.status === "featured").slice(0, 3);
  }, [stories]);

  // Get unique industries
  const industries = useMemo(() => {
    const uniqueIndustries = [...new Set(stories.map((s) => s.industry).filter(Boolean))];
    return uniqueIndustries.sort();
  }, [stories]);

  // Get unique provinces
  const provinces = useMemo(() => {
    const uniqueProvinces = [...new Set(stories.map((s) => s.province).filter(Boolean))];
    return uniqueProvinces.sort();
  }, [stories]);

  // Filter stories
  const filteredStories = useMemo(() => {
    let result = [...stories];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (story) =>
          story.title.toLowerCase().includes(searchLower) ||
          story.story.toLowerCase().includes(searchLower) ||
          story.business_name.toLowerCase().includes(searchLower)
      );
    }

    // Industry filter
    if (filters.industry) {
      result = result.filter((story) => story.industry === filters.industry);
    }

    // Province filter
    if (filters.province) {
      result = result.filter((story) => story.province === filters.province);
    }

    // Side hustle filter
    if (filters.sideHustleOnly) {
      result = result.filter((story) => story.is_side_hustle === true);
    }

    // Newcomer filter
    if (filters.newcomerOnly) {
      result = result.filter((story) => story.is_newcomer === true);
    }

    return result;
  }, [stories, filters]);

  // Submit a new story
  const submitMutation = useMutation({
    mutationFn: async (data: SubmitStoryData) => {
      if (!user) throw new Error("Must be logged in to submit a story");

      const { data: newStory, error } = await supabase
        .from("success_stories")
        .insert({
          ...data,
          user_id: user.id,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;

      return newStory as SuccessStory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-success-stories"] });
      toast({
        title: "Story Submitted!",
        description: "Your success story has been submitted for review. We'll notify you once it's approved.",
      });
    },
    onError: (error) => {
      console.error("Submit story error:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Failed to submit your story. Please try again.",
      });
    },
  });

  // Update own story (pending only)
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<SubmitStoryData> & { id: string }) => {
      if (!user) throw new Error("Must be logged in to update a story");

      const { data: updatedStory, error } = await supabase
        .from("success_stories")
        .update(data)
        .eq("id", id)
        .eq("user_id", user.id)
        .eq("status", "pending")
        .select()
        .single();

      if (error) throw error;

      return updatedStory as SuccessStory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-success-stories"] });
      toast({
        title: "Story Updated",
        description: "Your success story has been updated.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update your story. Please try again.",
      });
    },
  });

  // Delete own story (pending only)
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("Must be logged in to delete a story");

      const { error } = await supabase
        .from("success_stories")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)
        .eq("status", "pending");

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-success-stories"] });
      toast({
        title: "Story Deleted",
        description: "Your story has been deleted.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: "Failed to delete your story. Please try again.",
      });
    },
  });

  // Get stats for landing page
  const stats = useMemo(() => {
    const approvedStories = stories.filter((s) => s.status === "approved" || s.status === "featured");
    const totalRevenue = approvedStories.reduce((sum, s) => sum + (s.monthly_revenue || 0), 0);
    const avgRevenue = approvedStories.length > 0 ? totalRevenue / approvedStories.length : 0;
    const sideHustlers = approvedStories.filter((s) => s.is_side_hustle).length;
    const newcomers = approvedStories.filter((s) => s.is_newcomer).length;

    return {
      totalStories: approvedStories.length,
      avgMonthlyRevenue: Math.round(avgRevenue),
      sideHustlerCount: sideHustlers,
      newcomerCount: newcomers,
    };
  }, [stories]);

  // Format currency
  const formatCurrency = (value: number | null): string => {
    if (value === null) return "N/A";
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  // Get status badge info
  const getStatusBadge = (status: SuccessStory["status"]) => {
    switch (status) {
      case "pending":
        return { label: "Pending Review", color: "bg-warning/10 text-warning" };
      case "approved":
        return { label: "Approved", color: "bg-success/10 text-success" };
      case "featured":
        return { label: "Featured", color: "bg-primary/10 text-primary" };
      case "rejected":
        return { label: "Not Approved", color: "bg-destructive/10 text-destructive" };
      default:
        return { label: status, color: "bg-muted text-muted-foreground" };
    }
  };

  return {
    // Data
    stories: filteredStories,
    allStories: stories,
    myStories,
    featuredStories,
    stats,

    // Loading states
    isLoading,
    isLoadingMyStories,
    error,

    // Filters
    filters,
    setFilters,
    industries,
    provinces,

    // Mutations
    submitStory: submitMutation.mutate,
    isSubmitting: submitMutation.isPending,
    updateStory: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteStory: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,

    // Helpers
    formatCurrency,
    getStatusBadge,
  };
};
