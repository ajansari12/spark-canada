import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BusinessIdea } from "@/types/idea";

export interface DeepDiveReport {
  ideaId: string;
  ideaName: string;
  generatedAt: string;

  // Overall Scores
  overallScore: number;
  marketSizeScore: number;
  competitionScore: number;
  communityDemandScore: number;
  regulatoryEaseScore: number;
  fundingAvailabilityScore: number;

  // Pain Point Analysis
  painPointSeverity: number;
  painPointDescription: string;
  painPointSources: string[];

  // Market Analysis
  canadianTAM: string;
  provincialOpportunities: Record<string, string>;
  growthTrend: 'rising' | 'stable' | 'declining';
  marketInsights: string[];

  // Competition
  competitorCount: string;
  topCompetitors: Array<{
    name: string;
    description: string;
    weakness: string;
  }>;
  marketGaps: string[];
  differentiationStrategies: string[];

  // Community Signals
  communityInsights: string[];
  targetAudience: string[];
  customerAcquisitionChannels: string[];

  // Regulatory & Compliance
  federalRequirements: string[];
  provincialRequirements: string[];
  licensesNeeded: string[];
  complianceComplexity: 'low' | 'medium' | 'high';

  // Funding Opportunities
  matchedGrants: Array<{
    name: string;
    amount: string;
    eligibility: string;
  }>;
  fundingStrategies: string[];

  // Execution Plan
  quickWins: string[];
  criticalMilestones: Array<{
    timeline: string;
    milestone: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  potentialChallenges: string[];
  successFactors: string[];
}

interface UserProfile {
  isNewcomer?: boolean;
  isSideHustle?: boolean;
  experienceLevel?: string;
}

// Local storage key for caching reports
const DEEP_DIVE_CACHE_KEY = 'spark_deep_dive_reports';

// Get cached reports from local storage
const getCachedReports = (): Record<string, DeepDiveReport> => {
  try {
    const cached = localStorage.getItem(DEEP_DIVE_CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch {
    return {};
  }
};

// Save report to local storage cache
const cacheReport = (ideaId: string, report: DeepDiveReport) => {
  try {
    const cached = getCachedReports();
    cached[ideaId] = report;
    localStorage.setItem(DEEP_DIVE_CACHE_KEY, JSON.stringify(cached));
  } catch (error) {
    console.error("Failed to cache deep dive report:", error);
  }
};

export const useDeepDive = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentReport, setCurrentReport] = useState<DeepDiveReport | null>(null);

  // Generate a new Deep Dive report
  const generateMutation = useMutation({
    mutationFn: async ({ idea, userProfile }: { idea: BusinessIdea; userProfile?: UserProfile }) => {
      const { data, error } = await supabase.functions.invoke('deep-dive', {
        body: { idea, userProfile },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      return data.report as DeepDiveReport;
    },
    onSuccess: (report) => {
      setCurrentReport(report);
      cacheReport(report.ideaId, report);
      queryClient.invalidateQueries({ queryKey: ['deep-dive', report.ideaId] });

      toast({
        title: "Deep Dive Complete! 🔍",
        description: `Comprehensive research report generated for "${report.ideaName}"`,
      });
    },
    onError: (error) => {
      console.error("Deep Dive error:", error);
      toast({
        variant: "destructive",
        title: "Research Failed",
        description: error instanceof Error ? error.message : "Failed to generate research report",
      });
    },
  });

  // Get cached report for an idea
  const getCachedReport = (ideaId: string): DeepDiveReport | null => {
    const cached = getCachedReports();
    return cached[ideaId] || null;
  };

  // Check if a report exists for an idea
  const hasReport = (ideaId: string): boolean => {
    return !!getCachedReport(ideaId);
  };

  // Get score color based on value
  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  // Get score background based on value
  const getScoreBg = (score: number): string => {
    if (score >= 80) return "bg-success/10";
    if (score >= 60) return "bg-warning/10";
    return "bg-destructive/10";
  };

  // Get trend icon and color
  const getTrendInfo = (trend: 'rising' | 'stable' | 'declining') => {
    switch (trend) {
      case 'rising':
        return { icon: '📈', color: 'text-success', label: 'Growing Market' };
      case 'stable':
        return { icon: '➡️', color: 'text-warning', label: 'Stable Market' };
      case 'declining':
        return { icon: '📉', color: 'text-destructive', label: 'Declining Market' };
    }
  };

  // Get complexity info
  const getComplexityInfo = (complexity: 'low' | 'medium' | 'high') => {
    switch (complexity) {
      case 'low':
        return { color: 'text-success', label: 'Easy to Start' };
      case 'medium':
        return { color: 'text-warning', label: 'Moderate Requirements' };
      case 'high':
        return { color: 'text-destructive', label: 'Complex Regulations' };
    }
  };

  // Get priority color
  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'low':
        return 'bg-muted text-muted-foreground border-muted';
    }
  };

  return {
    // State
    currentReport,
    setCurrentReport,

    // Actions
    generateReport: generateMutation.mutate,
    isGenerating: generateMutation.isPending,

    // Cache helpers
    getCachedReport,
    hasReport,

    // Display helpers
    getScoreColor,
    getScoreBg,
    getTrendInfo,
    getComplexityInfo,
    getPriorityColor,
  };
};
