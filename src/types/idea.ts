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
  quick_wins: string[];
  competitors: string[];
  grants: string[];
  is_saved: boolean;
  created_at: string;
  updated_at: string;
}

export type ViewMode = "grid" | "list";

export type SortOption = "newest" | "oldest" | "score-high" | "score-low" | "cost-low" | "cost-high";

export interface IdeaFilters {
  search: string;
  industry: string | null;
  viabilityRange: [number, number];
  budgetRange: [number, number];
}
