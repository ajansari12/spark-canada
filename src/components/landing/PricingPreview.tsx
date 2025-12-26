import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, Building2 } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for exploring business ideas",
    icon: Sparkles,
    features: [
      "3 AI idea generations",
      "Basic viability scoring",
      "Province selection",
      "Community access",
    ],
    cta: "Get Started",
    popular: false,
    color: "muted",
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For serious entrepreneurs ready to launch",
    icon: Zap,
    features: [
      "Unlimited idea generations",
      "Advanced viability analysis",
      "Business plan exports",
      "Pitch deck generator",
      "Grant database access",
      "AI business chat",
      "Priority support",
    ],
    cta: "Start Free Trial",
    popular: true,
    color: "primary",
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "per month",
    description: "For teams and business coaches",
    icon: Building2,
    features: [
      "Everything in Pro",
      "Team collaboration",
      "API access",
      "Custom branding",
      "White-label reports",
      "Dedicated account manager",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    popular: false,
    color: "accent",
  },
];

const PricingPreview = () => {
  return (
    <section id="pricing" className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-warning/10 text-warning text-sm font-medium mb-4">
            Pricing
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Simple, Transparent{" "}
            <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free and upgrade as you grow. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`
                relative bg-card rounded-2xl border p-6 lg:p-8 transition-all duration-300
                ${plan.popular 
                  ? 'border-primary shadow-xl scale-105 z-10' 
                  : 'border-border hover:border-primary/30 hover:shadow-lg'
                }
              `}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Icon */}
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center mb-4
                ${plan.color === 'primary' ? 'bg-primary/10 text-primary' : ''}
                ${plan.color === 'accent' ? 'bg-accent/10 text-accent' : ''}
                ${plan.color === 'muted' ? 'bg-muted text-muted-foreground' : ''}
              `}>
                <plan.icon className="w-6 h-6" />
              </div>

              {/* Plan Name & Price */}
              <h3 className="font-display font-bold text-xl text-foreground mb-2">
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-display text-4xl font-bold text-foreground">
                  {plan.price}
                </span>
                <span className="text-muted-foreground">/{plan.period}</span>
              </div>
              <p className="text-muted-foreground text-sm mb-6">
                {plan.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={`
                      w-5 h-5 flex-shrink-0 mt-0.5
                      ${plan.popular ? 'text-primary' : 'text-success'}
                    `} />
                    <span className="text-foreground text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                className={`
                  w-full rounded-full
                  ${plan.popular ? 'btn-gradient' : ''}
                `}
                variant={plan.popular ? "default" : "outline"}
                size="lg"
                asChild
              >
                <Link to="/pricing">
                  {plan.cta}
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            🛡️ 30-day money-back guarantee · No credit card required for free plan
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingPreview;