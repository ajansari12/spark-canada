import { Check, Zap, Building2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription, SUBSCRIPTION_TIERS, SubscriptionTier } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const tierIcons = {
  free: Sparkles,
  pro: Zap,
  enterprise: Building2,
};

const Pricing = () => {
  const { user } = useAuth();
  const { tier: currentTier, loading, createCheckout, openCustomerPortal, subscribed } = useSubscription();
  const navigate = useNavigate();

  const handleSubscribe = async (tierKey: SubscriptionTier) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const tier = SUBSCRIPTION_TIERS[tierKey];
    
    if (tierKey === "free") {
      toast.info("You're already on the Free plan");
      return;
    }

    if (!tier.priceId) {
      toast.error("Unable to process subscription");
      return;
    }

    try {
      await createCheckout(tier.priceId);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to start checkout. Please try again.");
    }
  };

  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal();
    } catch (error) {
      console.error("Portal error:", error);
      toast.error("Failed to open subscription portal. Please try again.");
    }
  };

  const tiers = Object.entries(SUBSCRIPTION_TIERS).map(([key, value]) => ({
    key: key as SubscriptionTier,
    ...value,
    Icon: tierIcons[key as SubscriptionTier],
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that's right for your entrepreneurial journey. 
            Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier) => {
            const isCurrentPlan = currentTier === tier.key;
            const isPopular = tier.key === "pro";
            const Icon = tier.Icon;

            return (
              <Card
                key={tier.key}
                className={`relative p-8 flex flex-col ${
                  isPopular ? "border-primary shadow-lg scale-105" : ""
                } ${isCurrentPlan ? "ring-2 ring-primary" : ""}`}
              >
                {isPopular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}
                {isCurrentPlan && subscribed && (
                  <Badge variant="outline" className="absolute -top-3 right-4 bg-background">
                    Your Plan
                  </Badge>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">{tier.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">
                      ${tier.price}
                    </span>
                    <span className="text-muted-foreground">/month CAD</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrentPlan && subscribed ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleManageSubscription}
                    disabled={loading}
                  >
                    Manage Subscription
                  </Button>
                ) : tier.key === "free" ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={currentTier === "free" || loading}
                  >
                    {currentTier === "free" ? "Current Plan" : "Downgrade"}
                  </Button>
                ) : (
                  <Button
                    variant={isPopular ? "default" : "outline"}
                    className="w-full"
                    onClick={() => handleSubscribe(tier.key)}
                    disabled={loading}
                  >
                    {user ? "Subscribe Now" : "Get Started"}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            All plans include a 14-day money-back guarantee. No questions asked.
          </p>
          <p className="text-sm text-muted-foreground">
            Need a custom plan for your team?{" "}
            <a href="mailto:support@bizlaunch.ca" className="text-primary hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
