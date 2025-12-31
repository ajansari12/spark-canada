import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIdeas } from "@/hooks/useIdeas";
import { Button } from "@/components/ui/button";
import { IdeaCard } from "@/components/ideas/IdeaCard";
import { IdeasToolbar } from "@/components/ideas/IdeasToolbar";
import { IdeaDetailsPanel } from "@/components/ideas/IdeaDetailsPanel";
import { CompareModal } from "@/components/ideas/CompareModal";
import { ExportDialog } from "@/components/exports/ExportDialog";
import { AppHeader } from "@/components/layout/AppHeader";
import { BusinessIdea, ViewMode } from "@/types/idea";
import { Sparkles, Plus, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const Ideas = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const {
    ideas,
    isLoading,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    industries,
    deleteIdeas,
    isDeleting,
  } = useIdeas();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedIdea, setSelectedIdea] = useState<BusinessIdea | null>(null);
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleToggleCompare = (ideaId: string) => {
    setCompareIds((prev) => {
      const next = new Set(prev);
      if (next.has(ideaId)) {
        next.delete(ideaId);
      } else if (next.size < 3) {
        next.add(ideaId);
      }
      return next;
    });
  };

  const handleCompare = () => {
    if (compareIds.size >= 2) {
      setShowCompareModal(true);
    }
  };

  const handleDelete = () => {
    if (compareIds.size > 0) {
      deleteIdeas(Array.from(compareIds));
      setCompareIds(new Set());
      setSelectedIdea(null);
    }
  };

  const handleDeleteSingle = (id: string) => {
    deleteIdeas([id]);
    if (selectedIdea?.id === id) {
      setSelectedIdea(null);
    }
    compareIds.delete(id);
    setCompareIds(new Set(compareIds));
  };

  const compareIdeas = ideas.filter((i) => compareIds.has(i.id));

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-warm flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-muted-foreground">Loading your ideas...</p>
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
              <div className="w-8 h-8 rounded-lg bg-gradient-warm flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-foreground">
                My Ideas
              </span>
              <span className="text-muted-foreground">({ideas.length})</span>
            </div>

            <Button asChild className="btn-gradient gap-2">
              <Link to="/wizard">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Generate New Ideas</span>
                <span className="sm:hidden">New</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {ideas.length === 0 && !filters.search && !filters.industry &&
          !filters.sideHustleOnly && !filters.newcomerFriendlyOnly &&
          filters.minRecessionResistance === null && filters.minPainPointSeverity === null ? (
          /* Empty state */
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              No saved ideas yet
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Complete the wizard to generate personalized business ideas tailored to your skills
              and goals.
            </p>
            <Button asChild className="btn-gradient gap-2">
              <Link to="/wizard">
                <Sparkles className="w-4 h-4" />
                Start Generating Ideas
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Toolbar */}
            <IdeasToolbar
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              filters={filters}
              onFiltersChange={setFilters}
              sortBy={sortBy}
              onSortChange={setSortBy}
              industries={industries}
              selectedCount={0}
              compareCount={compareIds.size}
              onDelete={handleDelete}
              onCompare={handleCompare}
              onClearSelection={() => setCompareIds(new Set())}
              isDeleting={isDeleting}
              onExport={() => setShowExportDialog(true)}
              totalIdeas={ideas.length}
            />

            {/* Ideas grid/list with details panel */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Ideas list */}
              <div
                className={cn(
                  viewMode === "grid"
                    ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
                    : "space-y-3"
                )}
              >
                {ideas.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">
                      No ideas match your filters. Try adjusting your search criteria.
                    </p>
                  </div>
                ) : (
                  ideas.map((idea) => (
                    <IdeaCard
                      key={idea.id}
                      idea={idea}
                      isSelected={selectedIdea?.id === idea.id}
                      isComparing={compareIds.has(idea.id)}
                      onSelect={() => setSelectedIdea(idea)}
                      onToggleCompare={() => handleToggleCompare(idea.id)}
                      viewMode={viewMode}
                    />
                  ))
                )}
              </div>

              {/* Details panel - sticky on desktop */}
              <div className="hidden lg:block lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
                <IdeaDetailsPanel
                  idea={selectedIdea}
                  onClose={() => setSelectedIdea(null)}
                  onDelete={handleDeleteSingle}
                />
              </div>
            </div>

            {/* Mobile details - could be a sheet/drawer */}
            {selectedIdea && (
              <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
                <div className="fixed inset-x-0 bottom-0 top-16 bg-background overflow-y-auto">
                  <div className="p-4">
                    <IdeaDetailsPanel
                      idea={selectedIdea}
                      onClose={() => setSelectedIdea(null)}
                      onDelete={handleDeleteSingle}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Compare Modal */}
      <CompareModal
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        ideas={compareIdeas}
      />

      {/* Export Dialog */}
      <ExportDialog
        ideas={ideas}
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
      />
    </div>
  );
};

export default Ideas;
