import { useState } from "react";
import { ActionPlan as ActionPlanType, ActionItem } from "@/types/idea";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Circle,
  Calendar,
  Scale,
  Settings,
  Megaphone,
  Briefcase,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionPlanProps {
  actionPlan: ActionPlanType | null;
  onToggleTask?: (phase: 'day30' | 'day60' | 'day90', taskIndex: number) => void;
}

const categoryIcons = {
  legal: Scale,
  setup: Settings,
  marketing: Megaphone,
  operations: Briefcase,
};

const categoryColors = {
  legal: "text-blue-500 bg-blue-500/10",
  setup: "text-purple-500 bg-purple-500/10",
  marketing: "text-orange-500 bg-orange-500/10",
  operations: "text-green-500 bg-green-500/10",
};

const phaseLabels = {
  day30: { label: "First 30 Days", description: "Foundation & Legal Setup" },
  day60: { label: "Days 31-60", description: "Launch & Marketing" },
  day90: { label: "Days 61-90", description: "Growth & First Customers" },
};

export const ActionPlan = ({ actionPlan, onToggleTask }: ActionPlanProps) => {
  const [expandedPhase, setExpandedPhase] = useState<string | null>("day30");

  if (!actionPlan) {
    return null;
  }

  const phases: Array<'day30' | 'day60' | 'day90'> = ['day30', 'day60', 'day90'];

  const getCompletionPercentage = (tasks: ActionItem[]): number => {
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const renderTaskItem = (
    task: ActionItem,
    index: number,
    phase: 'day30' | 'day60' | 'day90'
  ) => {
    const Icon = categoryIcons[task.category] || Briefcase;
    const colorClass = categoryColors[task.category] || categoryColors.operations;

    return (
      <div
        key={index}
        className={cn(
          "flex items-start gap-3 p-3 rounded-lg border transition-all",
          task.completed
            ? "bg-success/5 border-success/20"
            : "bg-card border-border hover:border-primary/30"
        )}
      >
        <button
          onClick={() => onToggleTask?.(phase, index)}
          className="flex-shrink-0 mt-0.5"
        >
          {task.completed ? (
            <CheckCircle2 className="w-5 h-5 text-success" />
          ) : (
            <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("p-1 rounded", colorClass)}>
              <Icon className="w-3 h-3" />
            </span>
            <span className="text-xs text-muted-foreground capitalize">
              {task.category}
            </span>
          </div>
          <p className={cn(
            "text-sm",
            task.completed ? "text-muted-foreground line-through" : "text-foreground"
          )}>
            {task.task}
          </p>

          {task.resources && task.resources.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {task.resources.map((resource, rIdx) => (
                <span
                  key={rIdx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground"
                >
                  <ExternalLink className="w-3 h-3" />
                  {resource}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">30-60-90 Day Action Plan</h3>
      </div>

      <div className="space-y-3">
        {phases.map((phase) => {
          const tasks = actionPlan[phase] || [];
          const isExpanded = expandedPhase === phase;
          const completion = getCompletionPercentage(tasks);
          const phaseInfo = phaseLabels[phase];

          return (
            <div
              key={phase}
              className="border border-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedPhase(isExpanded ? null : phase)}
                className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
                    completion === 100
                      ? "bg-success/20 text-success"
                      : "bg-primary/20 text-primary"
                  )}>
                    {completion}%
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-foreground">{phaseInfo.label}</div>
                    <div className="text-xs text-muted-foreground">{phaseInfo.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {tasks.filter(t => t.completed).length}/{tasks.length} tasks
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </button>

              {isExpanded && tasks.length > 0 && (
                <div className="p-4 space-y-2 bg-background">
                  {tasks.map((task, idx) => renderTaskItem(task, idx, phase))}
                </div>
              )}

              {isExpanded && tasks.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground bg-background">
                  No tasks for this phase yet.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
