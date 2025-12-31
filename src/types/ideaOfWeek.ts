import { PreValidatedIdea } from "./prevalidated";

export interface IdeaOfTheWeek {
  id: string;
  pre_validated_idea_id?: string;
  pre_validated_idea?: PreValidatedIdea;

  // Display data
  idea_name: string;
  idea_description: string;
  industry?: string;
  headline: string;
  highlight_points: string[];
  why_now?: string;

  // Scores
  viability_score?: number;
  recession_resistance?: number;
  pain_point_severity?: number;

  // Meta
  week_start: string;
  week_end: string;
  is_active: boolean;

  // Tracking
  views: number;
  clicks_to_wizard: number;
  clicks_to_grants: number;

  created_at: string;
}

// Get current week's Monday and Sunday dates
export function getCurrentWeekDates(): { weekStart: string; weekEnd: string } {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return {
    weekStart: monday.toISOString().split('T')[0],
    weekEnd: sunday.toISOString().split('T')[0],
  };
}
