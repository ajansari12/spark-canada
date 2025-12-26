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
          created_at: string
          deadline: string | null
          description: string
          eligibility: string | null
          funding_max: number | null
          funding_min: number | null
          grant_type: string
          id: string
          industries: string[] | null
          is_active: boolean
          name: string
          province: string | null
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          description: string
          eligibility?: string | null
          funding_max?: number | null
          funding_min?: number | null
          grant_type?: string
          id?: string
          industries?: string[] | null
          is_active?: boolean
          name: string
          province?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          deadline?: string | null
          description?: string
          eligibility?: string | null
          funding_max?: number | null
          funding_min?: number | null
          grant_type?: string
          id?: string
          industries?: string[] | null
          is_active?: boolean
          name?: string
          province?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      ideas: {
        Row: {
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
          province: string | null
          quick_wins: Json | null
          session_id: string | null
          skills_match_score: number | null
          startup_cost_max: number | null
          startup_cost_min: number | null
          updated_at: string
          user_id: string
          viability_score: number | null
        }
        Insert: {
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
          province?: string | null
          quick_wins?: Json | null
          session_id?: string | null
          skills_match_score?: number | null
          startup_cost_max?: number | null
          startup_cost_min?: number | null
          updated_at?: string
          user_id: string
          viability_score?: number | null
        }
        Update: {
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
          province?: string | null
          quick_wins?: Json | null
          session_id?: string | null
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
