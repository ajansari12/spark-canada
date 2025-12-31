import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type EmailTemplate =
  | 'welcome'
  | 'idea_generated'
  | 'action_plan_reminder'
  | 'grant_deadline'
  | 'weekly_digest';

interface SendEmailParams {
  to: string;
  template: EmailTemplate;
  data?: Record<string, unknown>;
}

interface NotificationPreferences {
  welcomeEmail: boolean;
  ideaGenerated: boolean;
  actionPlanReminders: boolean;
  grantDeadlines: boolean;
  weeklyDigest: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  welcomeEmail: true,
  ideaGenerated: true,
  actionPlanReminders: true,
  grantDeadlines: true,
  weeklyDigest: true,
};

// Local storage key for notification preferences
const NOTIFICATION_PREFS_KEY = 'spark_notification_preferences';

export const useNotifications = () => {
  const { user } = useAuth();

  // Get notification preferences from local storage
  const getPreferences = (): NotificationPreferences => {
    try {
      const stored = localStorage.getItem(NOTIFICATION_PREFS_KEY);
      if (stored) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error("Failed to load notification preferences:", error);
    }
    return DEFAULT_PREFERENCES;
  };

  // Save notification preferences to local storage
  const savePreferences = (prefs: Partial<NotificationPreferences>) => {
    try {
      const current = getPreferences();
      const updated = { ...current, ...prefs };
      localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error("Failed to save notification preferences:", error);
      return getPreferences();
    }
  };

  // Send email mutation
  const sendEmailMutation = useMutation({
    mutationFn: async ({ to, template, data }: SendEmailParams) => {
      const { data: result, error } = await supabase.functions.invoke('send-email', {
        body: { to, template, data },
      });

      if (error) throw error;
      if (result.error) throw new Error(result.error);

      return result;
    },
  });

  // Send welcome email
  const sendWelcomeEmail = async (email: string, name?: string) => {
    const prefs = getPreferences();
    if (!prefs.welcomeEmail) return;

    try {
      await sendEmailMutation.mutateAsync({
        to: email,
        template: 'welcome',
        data: { name },
      });
    } catch (error) {
      console.error("Failed to send welcome email:", error);
    }
  };

  // Send idea generated notification
  const sendIdeaGeneratedEmail = async (
    email: string,
    ideaCount: number,
    topIdea?: string,
    viabilityScore?: number
  ) => {
    const prefs = getPreferences();
    if (!prefs.ideaGenerated) return;

    try {
      await sendEmailMutation.mutateAsync({
        to: email,
        template: 'idea_generated',
        data: { ideaCount, topIdea, viabilityScore },
      });
    } catch (error) {
      console.error("Failed to send idea generated email:", error);
    }
  };

  // Send action plan reminder
  const sendActionPlanReminder = async (
    email: string,
    name: string | undefined,
    ideaName: string,
    nextTask: string | undefined,
    completedTasks: number,
    totalTasks: number
  ) => {
    const prefs = getPreferences();
    if (!prefs.actionPlanReminders) return;

    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    try {
      await sendEmailMutation.mutateAsync({
        to: email,
        template: 'action_plan_reminder',
        data: { name, ideaName, nextTask, completedTasks, totalTasks, progressPercent },
      });
    } catch (error) {
      console.error("Failed to send action plan reminder:", error);
    }
  };

  // Send grant deadline alert
  const sendGrantDeadlineAlert = async (
    email: string,
    grantName: string,
    deadline: string,
    fundingAmount: string,
    grantDescription?: string
  ) => {
    const prefs = getPreferences();
    if (!prefs.grantDeadlines) return;

    try {
      await sendEmailMutation.mutateAsync({
        to: email,
        template: 'grant_deadline',
        data: { grantName, deadline, fundingAmount, grantDescription },
      });
    } catch (error) {
      console.error("Failed to send grant deadline alert:", error);
    }
  };

  // Send weekly digest
  const sendWeeklyDigest = async (
    email: string,
    name: string | undefined,
    savedIdeasCount: number,
    tasksCompleted: number,
    newGrantsCount: number,
    ideaOfTheWeek?: string
  ) => {
    const prefs = getPreferences();
    if (!prefs.weeklyDigest) return;

    try {
      await sendEmailMutation.mutateAsync({
        to: email,
        template: 'weekly_digest',
        data: { name, savedIdeasCount, tasksCompleted, newGrantsCount, ideaOfTheWeek },
      });
    } catch (error) {
      console.error("Failed to send weekly digest:", error);
    }
  };

  return {
    // Preferences
    getPreferences,
    savePreferences,

    // Email sending functions
    sendWelcomeEmail,
    sendIdeaGeneratedEmail,
    sendActionPlanReminder,
    sendGrantDeadlineAlert,
    sendWeeklyDigest,

    // Raw mutation for custom emails
    sendEmail: sendEmailMutation.mutate,
    isSending: sendEmailMutation.isPending,
  };
};
