import { TIME_COMMITMENTS } from "@/types/wizard";
import { Slider } from "@/components/ui/slider";
import { Clock, Briefcase, Sun, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepTimeProps {
  commitment: 'part-time' | 'full-time' | 'flexible';
  hours: number;
  onChange: (commitment: 'part-time' | 'full-time' | 'flexible', hours: number) => void;
}

const icons = {
  'part-time': Sun,
  'full-time': Briefcase,
  'flexible': Zap,
};

const StepTime = ({ commitment, hours, onChange }: StepTimeProps) => {
  const handleCommitmentChange = (value: 'part-time' | 'full-time' | 'flexible') => {
    let defaultHours = hours;
    if (value === 'part-time') defaultHours = 15;
    if (value === 'full-time') defaultHours = 45;
    if (value === 'flexible') defaultHours = 25;
    onChange(value, defaultHours);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
          How much time can you commit?
        </h2>
        <p className="text-muted-foreground">
          Choose your availability for running your business
        </p>
      </div>

      {/* Time Commitment Options */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {TIME_COMMITMENTS.map((option) => {
          const Icon = icons[option.value];
          const isSelected = commitment === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => handleCommitmentChange(option.value)}
              className={cn(
                "p-6 rounded-xl border-2 transition-all text-center",
                "hover:scale-[1.02] active:scale-[0.98]",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border hover:border-primary/30"
              )}
            >
              <div className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4",
                isSelected ? "bg-white/20" : "bg-primary/10"
              )}>
                <Icon className={cn(
                  "w-7 h-7",
                  isSelected ? "" : "text-primary"
                )} />
              </div>
              <div className={cn(
                "font-semibold text-lg mb-1",
                isSelected ? "" : "text-foreground"
              )}>
                {option.label}
              </div>
              <div className={cn(
                "text-sm font-medium mb-2",
                isSelected ? "opacity-90" : "text-muted-foreground"
              )}>
                {option.hours}
              </div>
              <div className={cn(
                "text-xs",
                isSelected ? "opacity-80" : "text-muted-foreground"
              )}>
                {option.description}
              </div>
            </button>
          );
        })}
      </div>

      {/* Hours Slider */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold text-foreground">Hours per week</div>
              <div className="text-sm text-muted-foreground">Fine-tune your availability</div>
            </div>
          </div>
          <div className="font-display text-3xl font-bold text-primary">
            {hours}
            <span className="text-lg font-normal text-muted-foreground"> hrs</span>
          </div>
        </div>

        <Slider
          value={[hours]}
          min={5}
          max={60}
          step={5}
          onValueChange={(values) => onChange(commitment, values[0])}
          className="w-full"
        />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>5 hrs</span>
          <span>60+ hrs</span>
        </div>
      </div>

      {/* Insight */}
      <div className="mt-6 p-4 rounded-xl bg-muted/50 text-sm text-muted-foreground text-center">
        {hours < 20 ? (
          "Perfect for side hustles and low-maintenance businesses"
        ) : hours < 40 ? (
          "Great for service businesses and growing ventures"
        ) : (
          "Ideal for high-growth startups and intensive operations"
        )}
      </div>
    </div>
  );
};

export default StepTime;