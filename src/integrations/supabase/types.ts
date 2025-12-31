export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      documents: {
        Row: {
          created_at: string
          document_type: string
          file_name: string
          file_url: string | null
          id: string
          idea_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_type?: string
          file_name: string
          file_url?: string | null
          id?: string
          idea_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_type?: string
          file_name?: string
          file_url?: string | null
          id?: string
          idea_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      grants: {
        Row: {
          age_restrictions: string | null
          application_complexity: number | null
          approval_time_weeks: number | null
          created_at: string
          deadline: string | null
          description: string
          eligibility: string | null
          eligibility_criteria: Json | null
          experience_required: string | null
          funding_max: number | null
          funding_min: number | null
          grant_type: string
          id: string
          industries: string[] | null
          is_active: boolean
          last_verified_at: string | null
          name: string
          newcomer_eligible: boolean | null
          province: string | null
          side_hustle_eligible: boolean | null
          updated_at: string
          url: string
        }
        Insert: {
          age_restrictions?: string | null
          application_complexity?: number | null
          approval_time_weeks?: number | null
          created_at?: string
          deadline?: string | null
          description: string
          eligibility?: string | null
          eligibility_criteria?: Json | null
          experience_required?: string | null
          funding_max?: number | null
          funding_min?: number | null
          grant_type?: string
          id?: string
          industries?: string[] | null
          is_active?: boolean
          last_verified_at?: string | null
          name: string
          newcomer_eligible?: boolean | null
          province?: string | null
          side_hustle_eligible?: boolean | null
          updated_at?: string
          url: string
        }
        Update: {
          age_restrictions?: string | null
          application_complexity?: number | null
          approval_time_weeks?: number | null
          created_at?: string
          deadline?: string | null
          description?: string
          eligibility?: string | null
          eligibility_criteria?: Json | null
          experience_required?: string | null
          funding_max?: number | null
          funding_min?: number | null
          grant_type?: string
          id?: string
          industries?: string[] | null
          is_active?: boolean
          last_verified_at?: string | null
          name?: string
          newcomer_eligible?: boolean | null
          province?: string | null
          side_hustle_eligible?: boolean | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      ideas: {
        Row: {
          action_plan: Json | null
          ai_leverage_score: number | null
          competitors: Json | null
          created_at: string
          description: string
          grants: Json | null
          id: string
          industry: string | null
          is_saved: boolean
          market_fit_score: number | null
          monthly_revenue_max: number | null
          monthly_revenue_min: number | null
          name: string
          newcomer_friendly: boolean | null
          pain_point_severity: number | null
          province: string | null
          quick_wins: Json | null
          recession_resistance_score: number | null
          session_id: string | null
          side_hustle_compatible: boolean | null
          skills_match_score: number | null
          startup_cost_max: number | null
          startup_cost_min: number | null
          updated_at: string
          user_id: string
          viability_score: number | null
        }
        Insert: {
          action_plan?: Json | null
          ai_leverage_score?: number | null
          competitors?: Json | null
          created_at?: string
          description: string
          grants?: Json | null
          id?: string
          industry?: string | null
          is_saved?: boolean
          market_fit_score?: number | null
          monthly_revenue_max?: number | null
          monthly_revenue_min?: number | null
          name: string
          newcomer_friendly?: boolean | null
          pain_point_severity?: number | null
          province?: string | null
          quick_wins?: Json | null
          recession_resistance_score?: number | null
          session_id?: string | null
          side_hustle_compatible?: boolean | null
          skills_match_score?: number | null
          startup_cost_max?: number | null
          startup_cost_min?: number | null
          updated_at?: string
          user_id: string
          viability_score?: number | null
        }
        Update: {
          action_plan?: Json | null
          ai_leverage_score?: number | null
          competitors?: Json | null
          created_at?: string
          description?: string
          grants?: Json | null
          id?: string
          industry?: string | null
          is_saved?: boolean
          market_fit_score?: number | null
          monthly_revenue_max?: number | null
          monthly_revenue_min?: number | null
          name?: string
          newcomer_friendly?: boolean | null
          pain_point_severity?: number | null
          province?: string | null
          quick_wins?: Json | null
          recession_resistance_score?: number | null
          session_id?: string | null
          side_hustle_compatible?: boolean | null
          skills_match_score?: number | null
          startup_cost_max?: number | null
          startup_cost_min?: number | null
          updated_at?: string
          user_id?: string
          viability_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ideas_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string
          email: string | null
          full_name: string | null
          generation_reset_date: string | null
          id: string
          idea_generation_count: number
          province: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          generation_reset_date?: string | null
          id: string
          idea_generation_count?: number
          province?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          generation_reset_date?: string | null
          id?: string
          idea_generation_count?: number
          province?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          current_step: number
          id: string
          status: string
          updated_at: string
          user_id: string | null
          wizard_data: Json
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_step?: number
          id?: string
          status?: string
          updated_at?: string
          user_id?: string | null
          wizard_data?: Json
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_step?: number
          id?: string
          status?: string
          updated_at?: string
          user_id?: string | null
          wizard_data?: Json
        }
        Relationships: []
      }
      success_stories: {
        Row: {
          ai_tools_used: string[] | null
          approved_at: string | null
          business_name: string
          business_photo_url: string | null
          city: string | null
          created_at: string
          display_name: string | null
          employees_count: number | null
          id: string
          idea_id: string | null
          industry: string | null
          is_anonymous: boolean | null
          is_newcomer: boolean | null
          is_side_hustle: boolean | null
          monthly_revenue: number | null
          photo_url: string | null
          province: string | null
          quote: string | null
          spark_helped: boolean | null
          startup_cost: number | null
          status: string
          story: string
          time_to_first_sale: string | null
          title: string
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          ai_tools_used?: string[] | null
          approved_at?: string | null
          business_name: string
          business_photo_url?: string | null
          city?: string | null
          created_at?: string
          display_name?: string | null
          employees_count?: number | null
          id?: string
          idea_id?: string | null
          industry?: string | null
          is_anonymous?: boolean | null
          is_newcomer?: boolean | null
          is_side_hustle?: boolean | null
          monthly_revenue?: number | null
          photo_url?: string | null
          province?: string | null
          quote?: string | null
          spark_helped?: boolean | null
          startup_cost?: number | null
          status?: string
          story: string
          time_to_first_sale?: string | null
          title: string
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          ai_tools_used?: string[] | null
          approved_at?: string | null
          business_name?: string
          business_photo_url?: string | null
          city?: string | null
          created_at?: string
          display_name?: string | null
          employees_count?: number | null
          id?: string
          idea_id?: string | null
          industry?: string | null
          is_anonymous?: boolean | null
          is_newcomer?: boolean | null
          is_side_hustle?: boolean | null
          monthly_revenue?: number | null
          photo_url?: string | null
          province?: string | null
          quote?: string | null
          spark_helped?: boolean | null
          startup_cost?: number | null
          status?: string
          story?: string
          time_to_first_sale?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "success_stories_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
