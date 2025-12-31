import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MarketSignals {
  trends: string[];
  marketConditions: {
    sentiment: 'positive' | 'neutral' | 'negative';
    factors: string[];
  };
  competitiveLandscape: {
    saturation: 'low' | 'medium' | 'high';
    opportunities: string[];
  };
  seasonality?: {
    bestMonths: string[];
    slowMonths: string[];
  };
  timingScore: number;
  timingReason: string;
  citations?: string[];
  generatedAt: string;
  provider: 'perplexity' | 'claude' | 'lovable';
}

interface MarketSignalRequest {
  ideaName: string;
  industry: string;
  province: string;
  competitors?: string[];
}

export const useMarketSignals = () => {
  const fetchSignalsMutation = useMutation({
    mutationFn: async (request: MarketSignalRequest): Promise<MarketSignals> => {
      const { data, error } = await supabase.functions.invoke('market-signals', {
        body: request,
      });

      if (error) {
        throw new Error(error.message || 'Failed to fetch market signals');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return data.signals as MarketSignals;
    },
  });

  const fetchSignals = (request: MarketSignalRequest) => {
    fetchSignalsMutation.mutate(request);
  };

  const fetchSignalsAsync = async (request: MarketSignalRequest): Promise<MarketSignals> => {
    return fetchSignalsMutation.mutateAsync(request);
  };

  return {
    fetchSignals,
    fetchSignalsAsync,
    signals: fetchSignalsMutation.data,
    isLoading: fetchSignalsMutation.isPending,
    error: fetchSignalsMutation.error,
    reset: fetchSignalsMutation.reset,
  };
};

// Helper function to get sentiment color
export const getSentimentColor = (sentiment: 'positive' | 'neutral' | 'negative'): string => {
  switch (sentiment) {
    case 'positive':
      return 'text-green-600';
    case 'negative':
      return 'text-red-600';
    default:
      return 'text-yellow-600';
  }
};

// Helper function to get saturation badge variant
export const getSaturationVariant = (saturation: 'low' | 'medium' | 'high'): string => {
  switch (saturation) {
    case 'low':
      return 'default'; // Good - less competition
    case 'high':
      return 'destructive'; // Bad - lots of competition
    default:
      return 'secondary';
  }
};

// Helper function to get timing score color
export const getTimingScoreColor = (score: number): string => {
  if (score >= 7) return 'text-green-600';
  if (score >= 4) return 'text-yellow-600';
  return 'text-red-600';
};
