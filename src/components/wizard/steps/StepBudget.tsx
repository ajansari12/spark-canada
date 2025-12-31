import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { BUDGET_RANGES } from "@/types/wizard";
import { DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepBudgetProps {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}

const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
};

const StepBudget = ({ min, max, onChange }: StepBudgetProps) => {
  const [sliderValue, setSliderValue] = useState([min, max]);

  const handleSliderChange = (values: number[]) => {
    setSliderValue(values);
    onChange(values[0], values[1]);
  };

  const selectPreset = (preset: typeof BUDGET_RANGES[0]) => {
    setSliderValue([preset.min, preset.max]);
    onChange(preset.min, preset.max);
  };

  const getSelectedPreset = () => {
    return BUDGET_RANGES.find(
      (r) => r.min === sliderValue[0] && r.max === sliderValue[1]
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
          What's your startup budget?
        </h2>
        <p className="text-muted-foreground">
          Select your available investment range for starting a business
        </p>
      </div>

      {/* Current Selection Display */}
      <div className="bg-card rounded-2xl border border-border p-6 mb-8">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <DollarSign className="w-7 h-7 text-primary" />
          </div>
          <div className="text-center">
            <div className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              {formatCurrency(sliderValue[0])} - {formatCurrency(sliderValue[1])}
            </div>
            <p className="text-muted-foreground text-sm">
              {getSelectedPreset()?.description || "Custom range"}
            </p>
          </div>
        </div>

        {/* Slider */}
        <div className="px-2">
          <Slider
            value={sliderValue}
            min={1000}
            max={250000}
            step={1000}
            onValueChange={handleSliderChange}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>$1K</span>
            <span>$250K+</span>
          </div>
        </div>
      </div>

      {/* Quick Select Presets */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {BUDGET_RANGES.map((range) => {
          const isSelected = sliderValue[0] === range.min && sliderValue[1] === range.max;
          
          return (
            <button
              key={range.label}
              onClick={() => selectPreset(range)}
              className={cn(
                "p-4 rounded-xl border-2 transition-all text-left",
                "hover:scale-[1.02] active:scale-[0.98]",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border hover:border-primary/30"
              )}
            >
              <div className={cn(
                "font-semibold mb-1",
                isSelected ? "" : "text-foreground"
              )}>
                {range.label}
              </div>
              <div className={cn(
                "text-sm",
                isSelected ? "opacity-90" : "text-muted-foreground"
              )}>
                {range.description}
              </div>
            </button>
          );
        })}
      </div>

      {/* Tip */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        Tip: Include funds for first 6 months of operating expenses
      </p>
    </div>
  );
};

export default StepBudget;