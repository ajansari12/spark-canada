import { ViewMode, SortOption, IdeaFilters } from "@/types/idea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Grid3X3, List, SlidersHorizontal, Trash2, GitCompare, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface IdeasToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  filters: IdeaFilters;
  onFiltersChange: (filters: IdeaFilters) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  industries: (string | null)[];
  selectedCount: number;
  compareCount: number;
  onDelete: () => void;
  onCompare: () => void;
  onClearSelection: () => void;
  isDeleting: boolean;
}

export const IdeasToolbar = ({
  viewMode,
  onViewModeChange,
  filters,
  onFiltersChange,
  sortBy,
  onSortChange,
  industries,
  selectedCount,
  compareCount,
  onDelete,
  onCompare,
  onClearSelection,
  isDeleting,
}: IdeasToolbarProps) => {
  const hasActiveFilters = filters.search || filters.industry;

  return (
    <div className="space-y-4">
      {/* Main toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search ideas..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {/* Industry filter */}
          <Select
            value={filters.industry || "all"}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, industry: value === "all" ? null : value })
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry || ""}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="score-high">Highest Score</SelectItem>
              <SelectItem value="score-low">Lowest Score</SelectItem>
              <SelectItem value="cost-low">Lowest Cost</SelectItem>
              <SelectItem value="cost-high">Highest Cost</SelectItem>
            </SelectContent>
          </Select>

          {/* View toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-none h-10",
                viewMode === "grid" && "bg-muted"
              )}
              onClick={() => onViewModeChange("grid")}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-none h-10",
                viewMode === "list" && "bg-muted"
              )}
              onClick={() => onViewModeChange("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Selection actions bar */}
      {(selectedCount > 0 || compareCount > 0) && (
        <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {compareCount > 0 ? `${compareCount} selected for comparison` : ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {compareCount >= 2 && (
              <Button variant="default" size="sm" onClick={onCompare} className="gap-2">
                <GitCompare className="w-4 h-4" />
                Compare ({compareCount})
              </Button>
            )}
            {compareCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearSelection}>
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
            {compareCount > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={onDelete}
                disabled={isDeleting}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete ({compareCount})
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Active filters indicator */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {filters.search && (
            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center gap-1">
              "{filters.search}"
              <button
                onClick={() => onFiltersChange({ ...filters, search: "" })}
                className="hover:text-primary/70"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.industry && (
            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center gap-1">
              {filters.industry}
              <button
                onClick={() => onFiltersChange({ ...filters, industry: null })}
                className="hover:text-primary/70"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
