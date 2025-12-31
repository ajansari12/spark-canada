import { useState, useRef } from "react";
import { INDUSTRIES } from "@/types/wizard";
import { 
  UtensilsCrossed, 
  Laptop, 
  Heart, 
  ShoppingBag, 
  Palette, 
  GraduationCap,
  Building2,
  Briefcase,
  Home,
  Dog,
  MapPin,
  Leaf,
  Car,
  Sparkles,
  DollarSign,
  Factory,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndustriesProps {
  selected: string[];
  onChange: (industries: string[]) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  UtensilsCrossed,
  Laptop,
  Heart,
  ShoppingBag,
  Palette,
  GraduationCap,
  Building2,
  Briefcase,
  Home,
  Dog,
  MapPin,
  Leaf,
  Car,
  Sparkles,
  DollarSign,
  Factory,
};

const colorClasses = {
  primary: "bg-primary/10 text-primary border-primary/20 hover:border-primary/50",
  success: "bg-success/10 text-success border-success/20 hover:border-success/50",
  accent: "bg-accent/10 text-accent border-accent/20 hover:border-accent/50",
  warning: "bg-warning/10 text-warning border-warning/20 hover:border-warning/50",
};

const selectedColorClasses = {
  primary: "bg-primary text-primary-foreground border-primary",
  success: "bg-success text-success-foreground border-success",
  accent: "bg-accent text-accent-foreground border-accent",
  warning: "bg-warning text-warning-foreground border-warning",
};

const StepIndustries = ({ selected, onChange }: StepIndustriesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleIndustry = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((i) => i !== id));
    } else if (selected.length < 5) {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Which industries interest you?
        </h2>
        <p className="text-muted-foreground">
          Select 1-5 industries you'd like to explore for your business
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm">
          <span className="font-medium text-foreground">{selected.length}</span>
          <span className="text-muted-foreground">of 5 selected</span>
        </div>
      </div>

      {/* Industry Cards Grid */}
      <div 
        ref={containerRef}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        {INDUSTRIES.map((industry) => {
          const Icon = iconMap[industry.icon] || Sparkles;
          const isSelected = selected.includes(industry.id);
          
          return (
            <button
              key={industry.id}
              onClick={() => toggleIndustry(industry.id)}
              disabled={!isSelected && selected.length >= 5}
              className={cn(
                "relative p-4 sm:p-5 rounded-xl border-2 transition-all duration-200 text-left group",
                "hover:scale-[1.02] active:scale-[0.98]",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                isSelected
                  ? selectedColorClasses[industry.color]
                  : colorClasses[industry.color]
              )}
            >
              {/* Selected Check */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
              )}

              {/* Icon */}
              <div className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 transition-all",
                isSelected ? "bg-white/20" : `${colorClasses[industry.color].split(' ')[0]}`
              )}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              {/* Content */}
              <h3 className={cn(
                "font-semibold text-sm sm:text-base mb-1",
                isSelected ? "" : "text-foreground"
              )}>
                {industry.name}
              </h3>
              <p className={cn(
                "text-xs sm:text-sm line-clamp-2",
                isSelected ? "opacity-90" : "text-muted-foreground"
              )}>
                {industry.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Hint */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        Tip: Choose industries that match your interests or experience
      </p>
    </div>
  );
};

export default StepIndustries;