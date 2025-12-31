import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AppHeader } from "@/components/layout/AppHeader";
import { Skeleton } from "@/components/ui/skeleton";

interface Grant {
  id: string;
  name: string;
  description: string;
  url: string;
  province: string | null;
  funding_min: number | null;
  funding_max: number | null;
  grant_type: string;
  is_active: boolean;
  newcomer_eligible: boolean | null;
  side_hustle_eligible: boolean | null;
  deadline: string | null;
}

const emptyGrant: Omit<Grant, "id"> = {
  name: "",
  description: "",
  url: "",
  province: null,
  funding_min: null,
  funding_max: null,
  grant_type: "grant",
  is_active: true,
  newcomer_eligible: false,
  side_hustle_eligible: true,
  deadline: null,
};

const AdminGrants = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useAdminRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGrant, setEditingGrant] = useState<Grant | null>(null);
  const [formData, setFormData] = useState<Omit<Grant, "id">>(emptyGrant);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    } else if (!roleLoading && !isAdmin) {
      navigate("/app/dashboard");
    }
  }, [user, authLoading, isAdmin, roleLoading, navigate]);

  const { data: grants, isLoading } = useQuery({
    queryKey: ["admin-grants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("grants")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Grant[];
    },
    enabled: isAdmin,
  });

  const saveMutation = useMutation({
    mutationFn: async (grant: Omit<Grant, "id"> & { id?: string }) => {
      if (grant.id) {
        const { error } = await supabase
          .from("grants")
          .update(grant)
          .eq("id", grant.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("grants").insert(grant);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-grants"] });
      setIsDialogOpen(false);
      setEditingGrant(null);
      setFormData(emptyGrant);
      toast({
        title: editingGrant ? "Grant updated" : "Grant created",
        description: "The grant has been saved successfully.",
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

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("grants").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-grants"] });
      toast({
        title: "Grant deleted",
        description: "The grant has been removed.",
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

  const handleEdit = (grant: Grant) => {
    setEditingGrant(grant);
    setFormData({
      name: grant.name,
      description: grant.description,
      url: grant.url,
      province: grant.province,
      funding_min: grant.funding_min,
      funding_max: grant.funding_max,
      grant_type: grant.grant_type,
      is_active: grant.is_active,
      newcomer_eligible: grant.newcomer_eligible,
      side_hustle_eligible: grant.side_hustle_eligible,
      deadline: grant.deadline,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(editingGrant ? { ...formData, id: editingGrant.id } : formData);
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

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display text-3xl font-bold">Manage Grants</h1>
            <p className="text-muted-foreground">Add, edit, or remove grants</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingGrant(null);
                  setFormData(emptyGrant);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Grant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingGrant ? "Edit Grant" : "Add New Grant"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url">URL *</Label>
                    <Input
                      id="url"
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="province">Province</Label>
                    <Input
                      id="province"
                      value={formData.province || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, province: e.target.value || null })
                      }
                      placeholder="e.g., ON, BC, or National"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="funding_min">Min Funding ($)</Label>
                    <Input
                      id="funding_min"
                      type="number"
                      value={formData.funding_min || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          funding_min: e.target.value ? parseInt(e.target.value) : null,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="funding_max">Max Funding ($)</Label>
                    <Input
                      id="funding_max"
                      type="number"
                      value={formData.funding_max || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          funding_max: e.target.value ? parseInt(e.target.value) : null,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="grant_type">Grant Type</Label>
                    <Input
                      id="grant_type"
                      value={formData.grant_type}
                      onChange={(e) => setFormData({ ...formData, grant_type: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, deadline: e.target.value || null })
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_active: checked })
                      }
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="newcomer_eligible"
                      checked={formData.newcomer_eligible || false}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, newcomer_eligible: checked })
                      }
                    />
                    <Label htmlFor="newcomer_eligible">Newcomer Eligible</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="side_hustle_eligible"
                      checked={formData.side_hustle_eligible || false}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, side_hustle_eligible: checked })
                      }
                    />
                    <Label htmlFor="side_hustle_eligible">Side Hustle Eligible</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? "Saving..." : "Save Grant"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

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
                    <TableHead>Name</TableHead>
                    <TableHead>Province</TableHead>
                    <TableHead>Funding Range</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grants?.map((grant) => (
                    <TableRow key={grant.id}>
                      <TableCell className="font-medium">{grant.name}</TableCell>
                      <TableCell>{grant.province || "National"}</TableCell>
                      <TableCell>
                        {grant.funding_min && grant.funding_max
                          ? `$${grant.funding_min.toLocaleString()} - $${grant.funding_max.toLocaleString()}`
                          : grant.funding_max
                          ? `Up to $${grant.funding_max.toLocaleString()}`
                          : "Varies"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            grant.is_active
                              ? "bg-success/10 text-success"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {grant.is_active ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(grant)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this grant?")) {
                              deleteMutation.mutate(grant.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!grants?.length && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No grants found. Add your first grant above.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminGrants;
