import { useCallback, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

// Analytics event types
export type AnalyticsEvent =
  | 'page_view'
  | 'wizard_started'
  | 'wizard_step_completed'
  | 'wizard_completed'
  | 'wizard_abandoned'
  | 'ideas_generated'
  | 'idea_saved'
  | 'idea_deleted'
  | 'idea_exported'
  | 'deep_dive_started'
  | 'deep_dive_completed'
  | 'chat_started'
  | 'chat_message_sent'
  | 'action_plan_task_completed'
  | 'grant_viewed'
  | 'success_story_viewed'
  | 'success_story_submitted'
  | 'subscription_started'
  | 'subscription_cancelled'
  | 'login'
  | 'signup'
  | 'logout';

interface EventProperties {
  [key: string]: string | number | boolean | undefined | null;
}

interface PageViewProperties {
  path: string;
  title?: string;
  referrer?: string;
}

// Local storage keys for analytics
const ANALYTICS_SESSION_KEY = 'spark_analytics_session';
const ANALYTICS_USER_KEY = 'spark_analytics_user';
const ANALYTICS_EVENTS_KEY = 'spark_analytics_events';

// Generate a unique session ID
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};

// Get or create session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem(ANALYTICS_SESSION_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(ANALYTICS_SESSION_KEY, sessionId);
  }
  return sessionId;
};

// Get anonymous user ID (persistent across sessions)
const getAnonymousId = (): string => {
  let anonymousId = localStorage.getItem(ANALYTICS_USER_KEY);
  if (!anonymousId) {
    anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem(ANALYTICS_USER_KEY, anonymousId);
  }
  return anonymousId;
};

// Store events locally (for future batch sending or debugging)
const storeEvent = (event: {
  name: AnalyticsEvent;
  properties: EventProperties;
  timestamp: string;
  sessionId: string;
  anonymousId: string;
  userId?: string;
}) => {
  try {
    const stored = localStorage.getItem(ANALYTICS_EVENTS_KEY);
    const events = stored ? JSON.parse(stored) : [];

    // Keep only last 100 events to prevent storage bloat
    events.push(event);
    if (events.length > 100) {
      events.shift();
    }

    localStorage.setItem(ANALYTICS_EVENTS_KEY, JSON.stringify(events));
  } catch (error) {
    console.error("Failed to store analytics event:", error);
  }
};

// Get stored events (for debugging or batch upload)
export const getStoredEvents = () => {
  try {
    const stored = localStorage.getItem(ANALYTICS_EVENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Clear stored events
export const clearStoredEvents = () => {
  localStorage.removeItem(ANALYTICS_EVENTS_KEY);
};

export const useAnalytics = () => {
  const { user } = useAuth();

  const sessionId = getSessionId();
  const anonymousId = getAnonymousId();

  // Track an event
  const track = useCallback(
    (eventName: AnalyticsEvent, properties: EventProperties = {}) => {
      const event = {
        name: eventName,
        properties: {
          ...properties,
          // Add common properties
          browser: navigator.userAgent,
          screen_width: window.innerWidth,
          screen_height: window.innerHeight,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        timestamp: new Date().toISOString(),
        sessionId,
        anonymousId,
        userId: user?.id,
      };

      // Log to console in development
      if (import.meta.env.DEV) {
        console.log("📊 Analytics Event:", event);
      }

      // Store locally
      storeEvent(event);

      // TODO: Send to analytics backend when configured
      // This is where you'd integrate with Posthog, Mixpanel, etc.
      // Example:
      // if (window.posthog) {
      //   window.posthog.capture(eventName, properties);
      // }
    },
    [sessionId, anonymousId, user?.id]
  );

  // Track page view
  const trackPageView = useCallback(
    (properties: PageViewProperties) => {
      track('page_view', {
        path: properties.path,
        title: properties.title || document.title,
        referrer: properties.referrer || document.referrer,
      });
    },
    [track]
  );

  // Track wizard events
  const trackWizardStarted = useCallback(() => {
    track('wizard_started');
  }, [track]);

  const trackWizardStep = useCallback(
    (step: number, stepName: string) => {
      track('wizard_step_completed', { step, step_name: stepName });
    },
    [track]
  );

  const trackWizardCompleted = useCallback(
    (industry?: string, province?: string, budget?: string) => {
      track('wizard_completed', { industry, province, budget });
    },
    [track]
  );

  const trackWizardAbandoned = useCallback(
    (lastStep: number) => {
      track('wizard_abandoned', { last_step: lastStep });
    },
    [track]
  );

  // Track idea events
  const trackIdeasGenerated = useCallback(
    (count: number, industry?: string) => {
      track('ideas_generated', { count, industry });
    },
    [track]
  );

  const trackIdeaSaved = useCallback(
    (ideaId: string, ideaName: string, industry?: string) => {
      track('idea_saved', { idea_id: ideaId, idea_name: ideaName, industry });
    },
    [track]
  );

  const trackIdeaDeleted = useCallback(
    (ideaId: string) => {
      track('idea_deleted', { idea_id: ideaId });
    },
    [track]
  );

  const trackIdeaExported = useCallback(
    (ideaId: string, format: string) => {
      track('idea_exported', { idea_id: ideaId, format });
    },
    [track]
  );

  // Track deep dive events
  const trackDeepDiveStarted = useCallback(
    (ideaId: string) => {
      track('deep_dive_started', { idea_id: ideaId });
    },
    [track]
  );

  const trackDeepDiveCompleted = useCallback(
    (ideaId: string, overallScore?: number) => {
      track('deep_dive_completed', { idea_id: ideaId, overall_score: overallScore });
    },
    [track]
  );

  // Track chat events
  const trackChatStarted = useCallback(
    (ideaId?: string) => {
      track('chat_started', { idea_id: ideaId });
    },
    [track]
  );

  const trackChatMessage = useCallback(
    (ideaId?: string) => {
      track('chat_message_sent', { idea_id: ideaId });
    },
    [track]
  );

  // Track action plan events
  const trackTaskCompleted = useCallback(
    (ideaId: string, phase: string, taskIndex: number) => {
      track('action_plan_task_completed', {
        idea_id: ideaId,
        phase,
        task_index: taskIndex,
      });
    },
    [track]
  );

  // Track grant events
  const trackGrantViewed = useCallback(
    (grantId: string, grantName: string) => {
      track('grant_viewed', { grant_id: grantId, grant_name: grantName });
    },
    [track]
  );

  // Track success story events
  const trackSuccessStoryViewed = useCallback(
    (storyId: string) => {
      track('success_story_viewed', { story_id: storyId });
    },
    [track]
  );

  const trackSuccessStorySubmitted = useCallback(() => {
    track('success_story_submitted');
  }, [track]);

  // Track subscription events
  const trackSubscriptionStarted = useCallback(
    (tier: string) => {
      track('subscription_started', { tier });
    },
    [track]
  );

  const trackSubscriptionCancelled = useCallback(
    (tier: string) => {
      track('subscription_cancelled', { tier });
    },
    [track]
  );

  // Track auth events
  const trackLogin = useCallback(
    (method: string) => {
      track('login', { method });
    },
    [track]
  );

  const trackSignup = useCallback(
    (method: string) => {
      track('signup', { method });
    },
    [track]
  );

  const trackLogout = useCallback(() => {
    track('logout');
  }, [track]);

  // Identify user (when they log in)
  const identify = useCallback(
    (userId: string, traits: EventProperties = {}) => {
      const identifyEvent = {
        type: 'identify',
        userId,
        traits: {
          ...traits,
          identified_at: new Date().toISOString(),
        },
        anonymousId,
        sessionId,
        timestamp: new Date().toISOString(),
      };

      if (import.meta.env.DEV) {
        console.log("📊 Analytics Identify:", identifyEvent);
      }

      // TODO: Send to analytics backend
      // if (window.posthog) {
      //   window.posthog.identify(userId, traits);
      // }
    },
    [anonymousId, sessionId]
  );

  // Auto-identify when user changes
  useEffect(() => {
    if (user?.id) {
      identify(user.id, {
        email: user.email,
      });
    }
  }, [user?.id, user?.email, identify]);

  return {
    // Core tracking
    track,
    trackPageView,
    identify,

    // Wizard tracking
    trackWizardStarted,
    trackWizardStep,
    trackWizardCompleted,
    trackWizardAbandoned,

    // Idea tracking
    trackIdeasGenerated,
    trackIdeaSaved,
    trackIdeaDeleted,
    trackIdeaExported,

    // Deep dive tracking
    trackDeepDiveStarted,
    trackDeepDiveCompleted,

    // Chat tracking
    trackChatStarted,
    trackChatMessage,

    // Action plan tracking
    trackTaskCompleted,

    // Grant tracking
    trackGrantViewed,

    // Success story tracking
    trackSuccessStoryViewed,
    trackSuccessStorySubmitted,

    // Subscription tracking
    trackSubscriptionStarted,
    trackSubscriptionCancelled,

    // Auth tracking
    trackLogin,
    trackSignup,
    trackLogout,

    // Utilities
    getStoredEvents,
    clearStoredEvents,
    sessionId,
    anonymousId,
  };
};
