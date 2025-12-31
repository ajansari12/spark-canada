import { useMemo, useCallback } from "react";
import { useGrants, Grant } from "@/hooks/useGrants";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export interface UserGrantProfile {
  province: string;
  age?: number;
  isNewcomer: boolean;
  yearsInCanada?: number;
  industries: string[];
  businessStage: 'idea' | 'startup' | 'growing';
  fundingNeeded: number;
  isSideHustle: boolean;
  experienceLevel?: 'beginner' | 'some' | 'experienced';
}

export interface GrantMatch {
  grant: Grant;
  score: number;
  matchPercentage: number;
  matchReasons: string[];
  missingRequirements: string[];
  estimatedApprovalWeeks?: number;
  priority: 'high' | 'medium' | 'low';
}

export const useGrantMatching = () => {
  const { grants, isLoading: grantsLoading } = useGrants();
  const { user } = useAuth();

  // Fetch user's wizard data for profile info
  const { data: userSession } = useQuery({
    queryKey: ["user-latest-session", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("sessions")
        .select("wizard_data")
        .eq("user_id", user.id)
        .eq("status", "completed")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data?.wizard_data as Record<string, unknown> | null;
    },
    enabled: !!user?.id,
  });

  // Build user profile from wizard data
  const buildUserProfile = useCallback((): UserGrantProfile | null => {
    if (!userSession) return null;

    return {
      province: (userSession.province as string) || '',
      isNewcomer: (userSession.isNewcomer as boolean) || false,
      yearsInCanada: userSession.yearsInCanada as number | undefined,
      industries: (userSession.industries as string[]) || [],
      businessStage: 'idea',
      fundingNeeded: (userSession.budgetMax as number) || 50000,
      isSideHustle: (userSession.isSideHustle as boolean) || false,
      experienceLevel: mapExperienceLevel(userSession.experienceLevel as string),
    };
  }, [userSession]);

  const calculateGrantMatch = useCallback((grant: Grant, profile: UserGrantProfile): GrantMatch => {
    let score = 0;
    const matchReasons: string[] = [];
    const missingRequirements: string[] = [];

    // Province match (30 points)
    if (!grant.province || grant.province === profile.province || grant.province === 'Federal') {
      score += 30;
      if (grant.province === 'Federal') {
        matchReasons.push('Federal program - available Canada-wide');
      } else {
        matchReasons.push(`Available in ${profile.province}`);
      }
    } else {
      missingRequirements.push(`Only available in ${grant.province}`);
    }

    // Industry match (25 points)
    const grantIndustries = grant.industries || [];
    if (grantIndustries.includes('all') || grantIndustries.length === 0) {
      score += 25;
      matchReasons.push('Open to all industries');
    } else {
      const industryMatch = grantIndustries.some(gi =>
        profile.industries.some(pi =>
          pi.toLowerCase().includes(gi.toLowerCase()) ||
          gi.toLowerCase().includes(pi.toLowerCase())
        )
      );
      if (industryMatch) {
        score += 25;
        matchReasons.push('Industry eligible');
      } else {
        missingRequirements.push(`Focuses on: ${grantIndustries.slice(0, 3).join(', ')}`);
      }
    }

    // Newcomer eligibility (15 points)
    if (profile.isNewcomer) {
      if (grant.newcomer_eligible) {
        score += 15;
        matchReasons.push('Newcomer-friendly program');
      } else if (grant.newcomer_eligible === false) {
        missingRequirements.push('May require Canadian work experience');
      }
    }

    // Age eligibility (10 points)
    if (grant.age_restrictions && profile.age) {
      const ageRange = parseAgeRange(grant.age_restrictions);
      if (ageRange && profile.age >= ageRange.min && profile.age <= ageRange.max) {
        score += 10;
        matchReasons.push(`Age eligible (${grant.age_restrictions})`);
      } else if (ageRange) {
        missingRequirements.push(`Age requirement: ${grant.age_restrictions}`);
      }
    } else if (grant.age_restrictions?.includes('39')) {
      // Futurpreneur-style youth grants
      matchReasons.push('For entrepreneurs under 40');
    }

    // Funding amount relevance (10 points)
    if (grant.funding_min !== null && grant.funding_max !== null) {
      if (profile.fundingNeeded >= (grant.funding_min || 0) &&
          profile.fundingNeeded <= (grant.funding_max || Infinity)) {
        score += 10;
        matchReasons.push('Funding amount matches your needs');
      }
    } else if (grant.funding_max && grant.funding_max >= profile.fundingNeeded) {
      score += 10;
      matchReasons.push(`Up to $${grant.funding_max.toLocaleString()} available`);
    }

    // Side hustle compatibility (5 points)
    if (profile.isSideHustle) {
      if (grant.side_hustle_eligible !== false) {
        score += 5;
        matchReasons.push('Part-time entrepreneurs welcome');
      } else {
        missingRequirements.push('May require full-time commitment');
      }
    }

    // Application complexity bonus (5 points for simple)
    if (grant.application_complexity !== undefined && grant.application_complexity <= 2) {
      score += 5;
      matchReasons.push('Simple application process');
    }

    // Calculate priority based on score and other factors
    let priority: 'high' | 'medium' | 'low' = 'low';
    if (score >= 80) {
      priority = 'high';
    } else if (score >= 50) {
      priority = 'medium';
    }

    // Boost priority if deadline is soon
    if (grant.deadline) {
      const daysUntilDeadline = Math.ceil(
        (new Date(grant.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      if (daysUntilDeadline > 0 && daysUntilDeadline <= 30 && score >= 50) {
        priority = 'high';
        matchReasons.push(`Deadline in ${daysUntilDeadline} days!`);
      }
    }

    return {
      grant,
      score,
      matchPercentage: Math.min(100, Math.round((score / 100) * 100)),
      matchReasons,
      missingRequirements,
      estimatedApprovalWeeks: grant.approval_time_weeks || undefined,
      priority,
    };
  }, []);

  // Get all matched grants for user
  const getMatchedGrants = useCallback((customProfile?: Partial<UserGrantProfile>): GrantMatch[] => {
    const baseProfile = buildUserProfile();
    if (!baseProfile && !customProfile) return [];

    const profile: UserGrantProfile = {
      province: customProfile?.province || baseProfile?.province || 'Ontario',
      isNewcomer: customProfile?.isNewcomer ?? baseProfile?.isNewcomer ?? false,
      yearsInCanada: customProfile?.yearsInCanada ?? baseProfile?.yearsInCanada,
      industries: customProfile?.industries || baseProfile?.industries || [],
      businessStage: customProfile?.businessStage || baseProfile?.businessStage || 'idea',
      fundingNeeded: customProfile?.fundingNeeded || baseProfile?.fundingNeeded || 50000,
      isSideHustle: customProfile?.isSideHustle ?? baseProfile?.isSideHustle ?? false,
      experienceLevel: customProfile?.experienceLevel || baseProfile?.experienceLevel,
      age: customProfile?.age || baseProfile?.age,
    };

    return grants
      .map(grant => calculateGrantMatch(grant, profile))
      .filter(match => match.score >= 30) // Only include reasonable matches
      .sort((a, b) => {
        // Sort by priority first, then by score
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return b.score - a.score;
      });
  }, [grants, buildUserProfile, calculateGrantMatch]);

  // Get top recommendations
  const getTopRecommendations = useCallback((limit = 5, customProfile?: Partial<UserGrantProfile>): GrantMatch[] => {
    return getMatchedGrants(customProfile).slice(0, limit);
  }, [getMatchedGrants]);

  // Get grants by priority
  const getHighPriorityGrants = useCallback((customProfile?: Partial<UserGrantProfile>): GrantMatch[] => {
    return getMatchedGrants(customProfile).filter(m => m.priority === 'high');
  }, [getMatchedGrants]);

  // Get grants with upcoming deadlines
  const getUpcomingDeadlineGrants = useCallback((daysAhead = 30): GrantMatch[] => {
    const now = Date.now();
    const cutoff = now + (daysAhead * 24 * 60 * 60 * 1000);

    return getMatchedGrants()
      .filter(match => {
        if (!match.grant.deadline) return false;
        const deadline = new Date(match.grant.deadline).getTime();
        return deadline > now && deadline <= cutoff;
      })
      .sort((a, b) => {
        const dateA = new Date(a.grant.deadline!).getTime();
        const dateB = new Date(b.grant.deadline!).getTime();
        return dateA - dateB;
      });
  }, [getMatchedGrants]);

  // Build profile from wizard data
  const userProfile = useMemo(() => buildUserProfile(), [buildUserProfile]);

  return {
    grants,
    isLoading: grantsLoading,
    userProfile,
    getMatchedGrants,
    getTopRecommendations,
    getHighPriorityGrants,
    getUpcomingDeadlineGrants,
    calculateGrantMatch,
  };
};

// Helper function to parse age range strings like "18-39"
function parseAgeRange(ageString: string): { min: number; max: number } | null {
  const match = ageString.match(/(\d+)\s*-\s*(\d+)/);
  if (match) {
    return {
      min: parseInt(match[1], 10),
      max: parseInt(match[2], 10),
    };
  }
  return null;
}

// Helper function to map experience level
function mapExperienceLevel(level: string | undefined): 'beginner' | 'some' | 'experienced' | undefined {
  if (!level) return undefined;
  if (level === 'none' || level === 'beginner') return 'beginner';
  if (level === 'some') return 'some';
  return 'experienced';
}
