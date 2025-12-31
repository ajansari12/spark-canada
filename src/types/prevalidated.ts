export interface PreValidatedIdea {
  id: string;
  name: string;
  description: string;
  industry: string;

  // Pre-researched data
  marketSize: string;
  competitorCount: number;
  topCompetitors: string[];
  startupCostMin: number;
  startupCostMax: number;
  monthlyRevenueMin: number;
  monthlyRevenueMax: number;

  // Scores
  viabilityScore: number;
  recessionResistanceScore: number;
  painPointSeverity: number; // 1-10
  aiLeverageScore: number;
  newcomerFriendly: boolean;
  sideHustleCompatible: boolean;

  // Canadian-specific
  bestProvinces: string[];
  relevantGrants: string[];
  regulatoryNotes: string[];

  // Community data
  redditMentions: number;
  searchVolume: string;
  growthTrend: 'rising' | 'stable' | 'declining';

  // Metadata
  researchHours: number;
  addedDate: string;
  lastUpdated: string;
  featured: boolean;
}

export interface PreValidatedFilters {
  search: string;
  industry: string | null;
  province: string | null;
  sideHustleOnly: boolean;
  newcomerFriendlyOnly: boolean;
  minViability: number | null;
  growthTrend: 'rising' | 'stable' | 'declining' | null;
}

export type PreValidatedSortOption =
  | 'newest'
  | 'viability-high'
  | 'viability-low'
  | 'pain-high'
  | 'cost-low'
  | 'cost-high'
  | 'recession-high';
