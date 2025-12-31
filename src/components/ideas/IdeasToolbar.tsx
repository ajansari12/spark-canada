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
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Search, Grid3X3, List, SlidersHorizontal, Trash2, GitCompare, X, Shield, Flame, Briefcase, Globe, Download } from "lucide-react";
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
  onExport?: () => void;
  totalIdeas?: number;
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
  onExport,
  totalIdeas = 0,
}: IdeasToolbarProps) => {
  const hasActiveFilters = filters.search || filters.industry ||
    filters.sideHustleOnly || filters.newcomerFriendlyOnly ||
    filters.minRecessionResistance !== null || filters.minPainPointSeverity !== null;

  const activeFilterCount = [
    filters.sideHustleOnly,
    filters.newcomerFriendlyOnly,
    filters.minRecessionResistance !== null,
    filters.minPainPointSeverity !== null,
  ].filter(Boolean).length;

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

          {/* 2026 Enhanced Filters */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <SlidersHorizontal className="w-4 h-4" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>2026 Filters</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuCheckboxItem
                checked={filters.sideHustleOnly}
                onCheckedChange={(checked) =>
                  onFiltersChange({ ...filters, sideHustleOnly: checked })
                }
              >
                <Briefcase className="w-4 h-4 mr-2 text-accent" />
                Side Hustle Compatible
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={filters.newcomerFriendlyOnly}
                onCheckedChange={(checked) =>
                  onFiltersChange({ ...filters, newcomerFriendlyOnly: checked })
                }
              >
                <Globe className="w-4 h-4 mr-2 text-success" />
                Newcomer Friendly
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">Minimum Scores</DropdownMenuLabel>

              <DropdownMenuCheckboxItem
                checked={filters.minRecessionResistance !== null}
                onCheckedChange={(checked) =>
                  onFiltersChange({ ...filters, minRecessionResistance: checked ? 70 : null })
                }
              >
                <Shield className="w-4 h-4 mr-2 text-blue-500" />
                Recession Resistant (70%+)
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={filters.minPainPointSeverity !== null}
                onCheckedChange={(checked) =>
                  onFiltersChange({ ...filters, minPainPointSeverity: checked ? 7 : null })
                }
              >
                <Flame className="w-4 h-4 mr-2 text-orange-500" />
                High Pain Point (7+)
              </DropdownMenuCheckboxItem>

              {activeFilterCount > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      onFiltersChange({
                        ...filters,
                        sideHustleOnly: false,
                        newcomerFriendlyOnly: false,
                        minRecessionResistance: null,
                        minPainPointSeverity: null,
                      })
                    }
                    className="text-destructive focus:text-destructive"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear All Filters
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export Button */}
          {onExport && totalIdeas > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          )}

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
        <div className="flex items-center gap-2 flex-wrap">
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
          {filters.sideHustleOnly && (
            <span className="px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              Side Hustle
              <button
                onClick={() => onFiltersChange({ ...filters, sideHustleOnly: false })}
                className="hover:text-accent/70"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.newcomerFriendlyOnly && (
            <span className="px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium flex items-center gap-1">
              <Globe className="w-3 h-3" />
              Newcomer OK
              <button
                onClick={() => onFiltersChange({ ...filters, newcomerFriendlyOnly: false })}
                className="hover:text-success/70"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.minRecessionResistance !== null && (
            <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Recession {filters.minRecessionResistance}%+
              <button
                onClick={() => onFiltersChange({ ...filters, minRecessionResistance: null })}
                className="hover:text-blue-500/70"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.minPainPointSeverity !== null && (
            <span className="px-2 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-medium flex items-center gap-1">
              <Flame className="w-3 h-3" />
              Pain {filters.minPainPointSeverity}+
              <button
                onClick={() => onFiltersChange({ ...filters, minPainPointSeverity: null })}
                className="hover:text-orange-500/70"
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
