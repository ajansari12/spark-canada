import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDocuments } from "@/hooks/useDocuments";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppHeader } from "@/components/layout/AppHeader";
import {
  FileText,
  Download,
  Trash2,
  Sparkles,
  Calendar,
  ExternalLink,
  Loader2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";

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

const Documents = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { fetchDocuments, deleteDocument } = useDocuments();
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const loadDocuments = async () => {
      if (user) {
        setIsLoading(true);
        const docs = await fetchDocuments();
        setDocuments(docs);
        setIsLoading(false);
      }
    };
    loadDocuments();
  }, [user]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const success = await deleteDocument(id);
    if (success) {
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    }
    setDeletingId(null);
  };

  const handleDownload = (url: string | null) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-warm flex items-center justify-center mx-auto mb-4 animate-pulse">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <p className="text-muted-foreground">Loading your documents...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Sub-header with page info */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-calm flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-foreground">
                My Documents
              </span>
              <span className="text-muted-foreground">({documents.length})</span>
            </div>

            <Button asChild className="btn-gradient gap-2">
              <Link to="/app/ideas">
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Generate Business Plan</span>
                <span className="sm:hidden">New</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {documents.length === 0 ? (
          /* Empty state */
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              No documents yet
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Generate business plans from your saved ideas to see them here.
            </p>
            <Button asChild className="btn-gradient gap-2">
              <Link to="/app/ideas">
                <Sparkles className="w-4 h-4" />
                View Saved Ideas
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <Card key={doc.id} className="card-warm hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-accent" />
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        doc.status === "completed"
                          ? "bg-success/10 text-success"
                          : doc.status === "failed"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                  <CardTitle className="text-base font-semibold mt-3 line-clamp-2">
                    {doc.file_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(doc.created_at), "MMM d, yyyy")}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => handleDownload(doc.file_url)}
                      disabled={!doc.file_url || doc.status !== "completed"}
                    >
                      {doc.file_url ? (
                        <>
                          <ExternalLink className="w-4 h-4" />
                          View
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Download
                        </>
                      )}
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          disabled={deletingId === doc.id}
                        >
                          {deletingId === doc.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete document?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{doc.file_name}". This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(doc.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Documents;
