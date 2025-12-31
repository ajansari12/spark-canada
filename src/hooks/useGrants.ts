import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BusinessIdea } from "@/types/idea";

export interface Grant {
  id: string;
  name: string;
  description: string;
  province: string | null;
  industries: string[];
  funding_min: number | null;
  funding_max: number | null;
  eligibility: string | null;
  deadline: string | null;
  url: string;
  grant_type: string;
  is_active: boolean;
  // Enhanced fields (2026)
  eligibility_criteria?: Record<string, unknown>;
  age_restrictions?: string | null;
  newcomer_eligible?: boolean;
  experience_required?: string | null;
  side_hustle_eligible?: boolean;
  application_complexity?: number;
  approval_time_weeks?: number | null;
}

interface MatchedGrant extends Grant {
  matchScore: number;
  matchReasons: string[];
}

interface UserProfile {
  isNewcomer?: boolean;
  isSideHustle?: boolean;
  age?: number;
  experienceLevel?: string;
  province?: string;
}

export const useGrants = () => {
  const { data: grants = [], isLoading, error } = useQuery({
    queryKey: ["grants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("grants")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      return data as Grant[];
    },
  });

  // Match grants to a business idea
  const matchGrantsToIdea = (idea: BusinessIdea, userProfile?: UserProfile): MatchedGrant[] => {
    if (!grants.length) return [];

    const matchedGrants: MatchedGrant[] = [];

    for (const grant of grants) {
      let matchScore = 0;
      const matchReasons: string[] = [];

      // Province matching (30 points max)
      if (grant.province === null) {
        // Federal grant - available everywhere
        matchScore += 20;
        matchReasons.push("Federal program - available Canada-wide");
      } else if (grant.province === idea.province) {
        matchScore += 30;
        matchReasons.push(`Available in ${idea.province}`);
      } else {
        // Province doesn't match
        continue;
      }

      // Industry matching (30 points max)
      const grantIndustries = grant.industries || [];
      const ideaIndustry = idea.industry?.toLowerCase().replace(/\s+/g, "_") || "";

      if (grantIndustries.includes("all")) {
        matchScore += 20;
        matchReasons.push("Available for all industries");
      } else if (grantIndustries.some(ind =>
        ind.toLowerCase() === ideaIndustry ||
        ideaIndustry.includes(ind.toLowerCase()) ||
        ind.toLowerCase().includes(ideaIndustry)
      )) {
        matchScore += 30;
        matchReasons.push(`Supports ${idea.industry} industry`);
      } else {
        // Check for related industries
        const relatedMatch = checkRelatedIndustries(ideaIndustry, grantIndustries);
        if (relatedMatch) {
          matchScore += 15;
          matchReasons.push("Related industry eligible");
        }
      }

      // Newcomer eligibility (10 points)
      if (userProfile?.isNewcomer && grant.newcomer_eligible) {
        matchScore += 10;
        matchReasons.push("Newcomer eligible");
      }

      // Side hustle eligibility (10 points)
      if (userProfile?.isSideHustle && grant.side_hustle_eligible !== false) {
        matchScore += 10;
        matchReasons.push("Part-time entrepreneurs welcome");
      }

      // Age restrictions (check if user qualifies)
      if (grant.age_restrictions && userProfile?.age) {
        const ageRange = parseAgeRange(grant.age_restrictions);
        if (ageRange && userProfile.age >= ageRange.min && userProfile.age <= ageRange.max) {
          matchScore += 10;
          matchReasons.push(`Age requirement met (${grant.age_restrictions})`);
        }
      } else if (grant.age_restrictions && !userProfile?.age) {
        // Can't verify age, but note the requirement
        if (grant.age_restrictions.includes("39")) {
          matchReasons.push("For entrepreneurs 18-39");
        }
      }

      // Funding amount relevance (10 points)
      const startupCost = idea.startup_cost_min || 0;
      if (grant.funding_max && grant.funding_max >= startupCost) {
        matchScore += 10;
        matchReasons.push(`Funding covers startup costs`);
      }

      // Application complexity bonus (5 points for easy applications)
      if (grant.application_complexity && grant.application_complexity <= 2) {
        matchScore += 5;
        matchReasons.push("Simple application process");
      }

      // Only include if there's a reasonable match
      if (matchScore >= 30 && matchReasons.length > 0) {
        matchedGrants.push({
          ...grant,
          matchScore,
          matchReasons,
        });
      }
    }

    // Sort by match score (highest first)
    return matchedGrants.sort((a, b) => b.matchScore - a.matchScore);
  };

  // Get top grants for an idea (for displaying in idea details)
  const getTopGrantsForIdea = (idea: BusinessIdea, userProfile?: UserProfile, limit = 5): MatchedGrant[] => {
    return matchGrantsToIdea(idea, userProfile).slice(0, limit);
  };

  // Get grants by category
  const getGrantsByType = (type: "grant" | "loan" | "tax_credit") => {
    return grants.filter(g => g.grant_type === type);
  };

  // Get newcomer-friendly grants
  const getNewcomerGrants = () => {
    return grants.filter(g => g.newcomer_eligible);
  };

  // Get grants for side hustlers
  const getSideHustleGrants = () => {
    return grants.filter(g => g.side_hustle_eligible !== false);
  };

  // Get youth grants (under 40)
  const getYouthGrants = () => {
    return grants.filter(g => g.age_restrictions?.includes("39") || g.name.toLowerCase().includes("youth"));
  };

  return {
    grants,
    isLoading,
    error,
    matchGrantsToIdea,
    getTopGrantsForIdea,
    getGrantsByType,
    getNewcomerGrants,
    getSideHustleGrants,
    getYouthGrants,
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

// Helper function to check related industries
function checkRelatedIndustries(ideaIndustry: string, grantIndustries: string[]): boolean {
  const industryRelations: Record<string, string[]> = {
    technology: ["manufacturing", "services", "retail"],
    food_beverage: ["retail", "agriculture", "manufacturing"],
    retail: ["services", "food_beverage"],
    services: ["technology", "retail"],
    manufacturing: ["technology", "clean_tech"],
    clean_tech: ["technology", "energy", "manufacturing"],
    life_sciences: ["technology", "manufacturing"],
    energy: ["clean_tech", "manufacturing"],
    agriculture: ["food_beverage", "manufacturing"],
  };

  const relatedIndustries = industryRelations[ideaIndustry] || [];
  return grantIndustries.some(ind => relatedIndustries.includes(ind.toLowerCase()));
}
