import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

export type SubscriptionTier = "free" | "pro" | "enterprise";

interface SubscriptionContextType {
  tier: SubscriptionTier;
  subscribed: boolean;
  subscriptionEnd: string | null;
  loading: boolean;
  refreshSubscription: () => Promise<void>;
  createCheckout: (priceId: string) => Promise<void>;
  openCustomerPortal: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Tier configuration with Stripe IDs
export const SUBSCRIPTION_TIERS = {
  free: {
    name: "Free",
    price: 0,
    priceId: null,
    productId: null,
    features: [
      "3 idea generations per month",
      "Basic market analysis",
      "Community support",
    ],
    limits: {
      ideaGenerations: 3,
    },
  },
  pro: {
    name: "Pro",
    price: 29,
    priceId: "price_1SihPKDHK97s3Wl2DFpXqpEn",
    productId: "prod_Tg3W23czGr5jln",
    features: [
      "Unlimited idea generations",
      "PDF business plan exports",
      "Priority email support",
      "Advanced market insights",
      "Competitor analysis",
    ],
    limits: {
      ideaGenerations: -1, // unlimited
    },
  },
  enterprise: {
    name: "Enterprise",
    price: 99,
    priceId: "price_1SihPvDHK97s3Wl2ClaqxoHg",
    productId: "prod_Tg3WFsfhBHocyY",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
      "White-label options",
    ],
    limits: {
      ideaGenerations: -1,
    },
  },
} as const;

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { user, session } = useAuth();
  const [tier, setTier] = useState<SubscriptionTier>("free");
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSubscription = useCallback(async () => {
    if (!session?.access_token) {
      setTier("free");
      setSubscribed(false);
      setSubscriptionEnd(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("check-subscription", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setSubscribed(data.subscribed);
      setTier(data.tier || "free");
      setSubscriptionEnd(data.subscription_end);
    } catch (error) {
      console.error("Error checking subscription:", error);
      setTier("free");
      setSubscribed(false);
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  const createCheckout = async (priceId: string) => {
    if (!session?.access_token) {
      throw new Error("You must be logged in to subscribe");
    }

    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: { priceId },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;
    if (data?.url) {
      window.open(data.url, "_blank");
    }
  };

  const openCustomerPortal = async () => {
    if (!session?.access_token) {
      throw new Error("You must be logged in to manage subscription");
    }

    const { data, error } = await supabase.functions.invoke("customer-portal", {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;
    if (data?.url) {
      window.open(data.url, "_blank");
    }
  };

  // Check subscription on mount and when user changes
  useEffect(() => {
    if (user) {
      refreshSubscription();
    } else {
      setTier("free");
      setSubscribed(false);
      setSubscriptionEnd(null);
      setLoading(false);
    }
  }, [user, refreshSubscription]);

  // Auto-refresh subscription every minute
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(refreshSubscription, 60000);
    return () => clearInterval(interval);
  }, [user, refreshSubscription]);

  return (
    <SubscriptionContext.Provider
      value={{
        tier,
        subscribed,
        subscriptionEnd,
        loading,
        refreshSubscription,
        createCheckout,
        openCustomerPortal,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};
