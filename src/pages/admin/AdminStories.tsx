import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, X, Eye, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AppHeader } from "@/components/layout/AppHeader";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface SuccessStory {
  id: string;
  title: string;
  business_name: string;
  story: string;
  industry: string | null;
  province: string | null;
  status: string;
  created_at: string;
  monthly_revenue: number | null;
  startup_cost: number | null;
  is_newcomer: boolean | null;
  display_name: string | null;
  quote: string | null;
}

const AdminStories = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useAdminRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    } else if (!roleLoading && !isAdmin) {
      navigate("/app/dashboard");
    }
  }, [user, authLoading, isAdmin, roleLoading, navigate]);

  const { data: stories, isLoading } = useQuery({
    queryKey: ["admin-stories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("success_stories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as SuccessStory[];
    },
    enabled: isAdmin,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updateData: { status: string; approved_at?: string } = { status };
      if (status === "approved" || status === "featured") {
        updateData.approved_at = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from("success_stories")
        .update(updateData)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-stories"] });
      toast({
        title: `Story ${status}`,
        description: `The story has been ${status}.`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-success/10 text-success border-success/20">Approved</Badge>;
      case "featured":
        return <Badge className="bg-primary/10 text-primary border-primary/20">Featured</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const pendingStories = stories?.filter((s) => s.status === "pending") || [];
  const otherStories = stories?.filter((s) => s.status !== "pending") || [];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-display text-3xl font-bold">Review Stories</h1>
            <p className="text-muted-foreground">
              Approve or reject user success stories
            </p>
          </div>
        </div>

        {/* Pending Stories */}
        {pendingStories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="bg-warning text-warning-foreground text-xs px-2 py-0.5 rounded-full">
                {pendingStories.length}
              </span>
              Pending Review
            </h2>
            <div className="grid gap-4">
              {pendingStories.map((story) => (
                <Card key={story.id} className="border-warning/30">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold">{story.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {story.business_name} • {story.industry || "Unknown industry"} •{" "}
                          {story.province || "Unknown location"}
                        </p>
                        <p className="text-sm line-clamp-2">{story.story}</p>
                        {story.quote && (
                          <blockquote className="mt-2 text-sm italic text-muted-foreground border-l-2 border-primary pl-3">
                            "{story.quote}"
                          </blockquote>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedStory(story)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-success border-success/30 hover:bg-success/10"
                          onClick={() =>
                            updateStatusMutation.mutate({ id: story.id, status: "approved" })
                          }
                          disabled={updateStatusMutation.isPending}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive border-destructive/30 hover:bg-destructive/10"
                          onClick={() =>
                            updateStatusMutation.mutate({ id: story.id, status: "rejected" })
                          }
                          disabled={updateStatusMutation.isPending}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Stories */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8">
                <Skeleton className="h-64" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {otherStories.map((story) => (
                    <TableRow key={story.id}>
                      <TableCell className="font-medium">{story.title}</TableCell>
                      <TableCell>{story.business_name}</TableCell>
                      <TableCell>
                        {story.province || "N/A"}
                      </TableCell>
                      <TableCell>{getStatusBadge(story.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(story.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedStory(story)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {story.status === "approved" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateStatusMutation.mutate({ id: story.id, status: "featured" })
                            }
                          >
                            <Star className="h-4 w-4 text-primary" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {!stories?.length && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No stories found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Story Detail Dialog */}
        <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedStory?.title}</DialogTitle>
            </DialogHeader>
            {selectedStory && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {getStatusBadge(selectedStory.status)}
                  {selectedStory.is_newcomer && (
                    <Badge variant="outline">Newcomer</Badge>
                  )}
                  {selectedStory.industry && (
                    <Badge variant="outline">{selectedStory.industry}</Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Business:</span>{" "}
                    {selectedStory.business_name}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location:</span>{" "}
                    {selectedStory.province || "N/A"}
                  </div>
                  {selectedStory.startup_cost && (
                    <div>
                      <span className="text-muted-foreground">Startup Cost:</span>{" "}
                      ${selectedStory.startup_cost.toLocaleString()}
                    </div>
                  )}
                  {selectedStory.monthly_revenue && (
                    <div>
                      <span className="text-muted-foreground">Monthly Revenue:</span>{" "}
                      ${selectedStory.monthly_revenue.toLocaleString()}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-2">Story</h4>
                  <p className="text-sm whitespace-pre-wrap">{selectedStory.story}</p>
                </div>

                {selectedStory.quote && (
                  <blockquote className="border-l-2 border-primary pl-4 italic text-muted-foreground">
                    "{selectedStory.quote}"
                    {selectedStory.display_name && (
                      <footer className="mt-1 text-sm">— {selectedStory.display_name}</footer>
                    )}
                  </blockquote>
                )}

                {selectedStory.status === "pending" && (
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      className="text-destructive"
                      onClick={() => {
                        updateStatusMutation.mutate({
                          id: selectedStory.id,
                          status: "rejected",
                        });
                        setSelectedStory(null);
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => {
                        updateStatusMutation.mutate({
                          id: selectedStory.id,
                          status: "approved",
                        });
                        setSelectedStory(null);
                      }}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminStories;
