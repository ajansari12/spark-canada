export interface BusinessIdea {
  id: string;
  user_id: string;
  session_id: string | null;
  name: string;
  description: string;
  industry: string | null;
  province: string | null;
  startup_cost_min: number | null;
  startup_cost_max: number | null;
  monthly_revenue_min: number | null;
  monthly_revenue_max: number | null;
  viability_score: number | null;
  market_fit_score: number | null;
  skills_match_score: number | null;
  // 2026 Enhanced Scoring
  recession_resistance_score: number | null; // 0-100: How well this business survives economic downturns
  pain_point_severity: number | null; // 1-10: How urgent is the problem this solves
  ai_leverage_score: number | null; // 0-100: How much AI can enhance this business
  side_hustle_compatible: boolean; // Can run with 10-20 hrs/week
  newcomer_friendly: boolean; // Doesn't require Canadian credentials
  // Action Plan (replacing quick_wins)
  quick_wins: string[];
  action_plan: ActionPlan | null;
  competitors: string[];
  grants: string[];
  is_saved: boolean;
  created_at: string;
  updated_at: string;
}

export interface ActionPlan {
  day30: ActionItem[];
  day60: ActionItem[];
  day90: ActionItem[];
}

export interface ActionItem {
  task: string;
  category: 'legal' | 'setup' | 'marketing' | 'operations';
  resources: string[];
  completed: boolean;
}

export type ViewMode = "grid" | "list";

export type SortOption = "newest" | "oldest" | "score-high" | "score-low" | "cost-low" | "cost-high";

export interface SuccessStory {
  id: string;
  user_id: string | null;
  title: string;
  story: string;
  quote: string | null;
  business_name: string;
  industry: string;
  province: string;
  city: string | null;
  startup_cost: number | null;
  monthly_revenue: number | null;
  time_to_first_sale: string | null;
  employees_count: number;
  is_side_hustle: boolean;
  is_newcomer: boolean;
  ai_tools_used: string[] | null;
  idea_id: string | null;
  spark_helped: boolean;
  photo_url: string | null;
  business_photo_url: string | null;
  website_url: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'featured';
  display_name: string | null;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
}

export interface SuccessStoryFilters {
  industry: string | null;
  province: string | null;
  sideHustleOnly: boolean;
  newcomerOnly: boolean;
  search: string;
}

export interface IdeaFilters {
  search: string;
  industry: string | null;
  viabilityRange: [number, number];
  budgetRange: [number, number];
  // 2026 Enhanced Filters
  sideHustleOnly: boolean;
  newcomerFriendlyOnly: boolean;
  minRecessionResistance: number | null; // 0-100, null = no filter
  minPainPointSeverity: number | null; // 1-10, null = no filter
}
