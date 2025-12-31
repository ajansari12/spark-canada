import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMutation } from "@tanstack/react-query";

export interface TrendData {
  industry: string;
  growth: number;
  score: number;
}

export interface TrendingOpportunity {
  title: string;
  description: string;
  trend: 'up' | 'down' | 'neutral';
  growth: string;
  category: string;
}

export interface MarketInsight {
  label: string;
  value: string;
  description: string;
}

export interface TrendsResponse {
  industryGrowth: TrendData[];
  trendingOpportunities: TrendingOpportunity[];
  marketInsights: MarketInsight[];
  seasonalOpportunities: { season: string; opportunities: string[] }[];
  businessTypeDistribution: { name: string; value: number }[];
  generatedAt: string;
  province?: string;
}

export const useTrendsData = () => {
  const [trendsData, setTrendsData] = useState<TrendsResponse | null>(null);

  const fetchTrendsMutation = useMutation({
    mutationFn: async (province: string): Promise<TrendsResponse> => {
      const { data, error } = await supabase.functions.invoke('fetch-trends', {
        body: { province },
      });

      if (error) {
        throw new Error(error.message || 'Failed to fetch trends');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return data.trends as TrendsResponse;
    },
    onSuccess: (data) => {
      setTrendsData(data);
    },
  });

  const fetchTrends = useCallback((province: string = 'all') => {
    fetchTrendsMutation.mutate(province);
  }, []);

  return {
    trendsData,
    fetchTrends,
    isLoading: fetchTrendsMutation.isPending,
    error: fetchTrendsMutation.error,
    reset: fetchTrendsMutation.reset,
  };
};
