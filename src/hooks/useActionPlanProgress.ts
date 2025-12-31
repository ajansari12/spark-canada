import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ActionPlan, ActionItem, BusinessIdea } from "@/types/idea";

interface ToggleTaskParams {
  ideaId: string;
  phase: 'day30' | 'day60' | 'day90';
  taskIndex: number;
  currentPlan: ActionPlan;
}

interface ActionPlanStats {
  totalTasks: number;
  completedTasks: number;
  completionPercentage: number;
  phaseStats: {
    day30: { total: number; completed: number; percentage: number };
    day60: { total: number; completed: number; percentage: number };
    day90: { total: number; completed: number; percentage: number };
  };
}

export const useActionPlanProgress = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Calculate stats for an action plan
  const getActionPlanStats = (actionPlan: ActionPlan | null): ActionPlanStats => {
    if (!actionPlan) {
      return {
        totalTasks: 0,
        completedTasks: 0,
        completionPercentage: 0,
        phaseStats: {
          day30: { total: 0, completed: 0, percentage: 0 },
          day60: { total: 0, completed: 0, percentage: 0 },
          day90: { total: 0, completed: 0, percentage: 0 },
        },
      };
    }

    const phases: Array<'day30' | 'day60' | 'day90'> = ['day30', 'day60', 'day90'];

    const phaseStats = phases.reduce((acc, phase) => {
      const tasks = actionPlan[phase] || [];
      const completed = tasks.filter(t => t.completed).length;
      const total = tasks.length;
      acc[phase] = {
        total,
        completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
      return acc;
    }, {} as ActionPlanStats['phaseStats']);

    const totalTasks = phases.reduce((sum, phase) => sum + (actionPlan[phase]?.length || 0), 0);
    const completedTasks = phases.reduce(
      (sum, phase) => sum + (actionPlan[phase]?.filter(t => t.completed).length || 0),
      0
    );

    return {
      totalTasks,
      completedTasks,
      completionPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      phaseStats,
    };
  };

  // Get the current phase based on completion
  const getCurrentPhase = (actionPlan: ActionPlan | null): 'day30' | 'day60' | 'day90' | 'complete' => {
    if (!actionPlan) return 'day30';

    const stats = getActionPlanStats(actionPlan);

    // If day30 is not complete, focus on day30
    if (stats.phaseStats.day30.percentage < 100) return 'day30';

    // If day60 is not complete, focus on day60
    if (stats.phaseStats.day60.percentage < 100) return 'day60';

    // If day90 is not complete, focus on day90
    if (stats.phaseStats.day90.percentage < 100) return 'day90';

    return 'complete';
  };

  // Get next uncompleted task
  const getNextTask = (actionPlan: ActionPlan | null): { phase: 'day30' | 'day60' | 'day90'; task: ActionItem; index: number } | null => {
    if (!actionPlan) return null;

    const phases: Array<'day30' | 'day60' | 'day90'> = ['day30', 'day60', 'day90'];

    for (const phase of phases) {
      const tasks = actionPlan[phase] || [];
      const index = tasks.findIndex(t => !t.completed);
      if (index !== -1) {
        return { phase, task: tasks[index], index };
      }
    }

    return null;
  };

  // Toggle task completion mutation
  const toggleTaskMutation = useMutation({
    mutationFn: async ({ ideaId, phase, taskIndex, currentPlan }: ToggleTaskParams) => {
      // Create a new action plan with the toggled task
      const updatedPlan: ActionPlan = {
        ...currentPlan,
        [phase]: currentPlan[phase].map((task, idx) =>
          idx === taskIndex ? { ...task, completed: !task.completed } : task
        ),
      };

      const { error } = await supabase
        .from("ideas")
        .update({ action_plan: updatedPlan })
        .eq("id", ideaId);

      if (error) throw error;

      return updatedPlan;
    },
    onSuccess: (updatedPlan, { phase, taskIndex, currentPlan }) => {
      // Invalidate ideas query to refetch
      queryClient.invalidateQueries({ queryKey: ["ideas"] });

      const task = currentPlan[phase][taskIndex];
      const wasCompleted = task.completed;

      toast({
        title: wasCompleted ? "Task Uncompleted" : "Task Completed! 🎉",
        description: wasCompleted
          ? `"${task.task}" marked as incomplete.`
          : `Great progress on "${task.task}"!`,
      });

      // Check if phase is complete
      const stats = getActionPlanStats(updatedPlan);
      if (!wasCompleted && stats.phaseStats[phase].percentage === 100) {
        toast({
          title: `${phase === 'day30' ? 'First 30 Days' : phase === 'day60' ? 'Days 31-60' : 'Days 61-90'} Complete! 🏆`,
          description: "Amazing work! Ready for the next phase.",
        });
      }

      // Check if entire plan is complete
      if (!wasCompleted && stats.completionPercentage === 100) {
        toast({
          title: "Action Plan Complete! 🚀",
          description: "Congratulations! You've completed your 90-day action plan!",
        });
      }
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update task status. Please try again.",
      });
    },
  });

  // Reset all tasks in a phase
  const resetPhaseMutation = useMutation({
    mutationFn: async ({ ideaId, phase, currentPlan }: { ideaId: string; phase: 'day30' | 'day60' | 'day90'; currentPlan: ActionPlan }) => {
      const updatedPlan: ActionPlan = {
        ...currentPlan,
        [phase]: currentPlan[phase].map(task => ({ ...task, completed: false })),
      };

      const { error } = await supabase
        .from("ideas")
        .update({ action_plan: updatedPlan })
        .eq("id", ideaId);

      if (error) throw error;

      return updatedPlan;
    },
    onSuccess: (_, { phase }) => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      toast({
        title: "Phase Reset",
        description: `All tasks in ${phase === 'day30' ? 'First 30 Days' : phase === 'day60' ? 'Days 31-60' : 'Days 61-90'} have been reset.`,
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Reset Failed",
        description: "Failed to reset phase. Please try again.",
      });
    },
  });

  return {
    // Stats functions
    getActionPlanStats,
    getCurrentPhase,
    getNextTask,

    // Mutations
    toggleTask: toggleTaskMutation.mutate,
    isToggling: toggleTaskMutation.isPending,
    resetPhase: resetPhaseMutation.mutate,
    isResetting: resetPhaseMutation.isPending,
  };
};
