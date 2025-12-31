import { Link } from "react-router-dom";
import { RecentIdea } from "@/hooks/useDashboardStats";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Lightbulb, ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface RecentIdeasCarouselProps {
  ideas: RecentIdea[];
  isLoading: boolean;
}

export const RecentIdeasCarousel = ({ ideas, isLoading }: RecentIdeasCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [ideas]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  const getScoreColor = (score: number | null): string => {
    if (score === null) return "text-muted-foreground";
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-muted-foreground";
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground">Recent Ideas</h2>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-shrink-0 w-64 h-40 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-foreground">Recent Ideas</h2>
        <div className="bg-muted/30 rounded-xl border border-dashed border-border p-8 text-center">
          <Lightbulb className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">No saved ideas yet</p>
          <Button asChild variant="outline" size="sm">
            <Link to="/wizard">Generate Your First Idea</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-foreground">Recent Ideas</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button asChild variant="ghost" size="sm" className="gap-1">
            <Link to="/app/ideas">
              View All
              <ArrowRight className="w-3 h-3" />
            </Link>
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {ideas.map((idea) => (
          <Link
            key={idea.id}
            to="/app/ideas"
            className="flex-shrink-0 w-64 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all card-warm group"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {idea.industry || "General"}
              </span>
              <span className={cn("font-display font-bold text-lg", getScoreColor(idea.viability_score))}>
                {idea.viability_score ?? "—"}
              </span>
            </div>
            <h3 className="font-display font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {idea.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{idea.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
