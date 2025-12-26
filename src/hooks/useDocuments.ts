import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

interface Document {
  id: string;
  user_id: string;
  idea_id: string | null;
  document_type: string;
  file_url: string | null;
  file_name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useDocuments = () => {
  const { session } = useAuth();
  const [generating, setGenerating] = useState(false);

  const generateBusinessPlan = async (ideaId: string): Promise<Document | null> => {
    if (!session?.access_token) {
      toast.error("You must be logged in to generate documents");
      return null;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-pdf", {
        body: { ideaId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      toast.success("Business plan generated successfully!");
      
      // Open the document in a new tab
      if (data.downloadUrl) {
        window.open(data.downloadUrl, "_blank");
      }

      return data.document;
    } catch (error) {
      console.error("Error generating document:", error);
      toast.error("Failed to generate business plan. Please try again.");
      return null;
    } finally {
      setGenerating(false);
    }
  };

  const fetchDocuments = async (ideaId?: string): Promise<Document[]> => {
    let query = supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });

    if (ideaId) {
      query = query.eq("idea_id", ideaId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching documents:", error);
      return [];
    }

    return data || [];
  };

  const deleteDocument = async (documentId: string): Promise<boolean> => {
    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", documentId);

    if (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
      return false;
    }

    toast.success("Document deleted");
    return true;
  };

  return {
    generating,
    generateBusinessPlan,
    fetchDocuments,
    deleteDocument,
  };
};
