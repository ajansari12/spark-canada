import { 
  Brain, 
  Target, 
  MapPin, 
  FileText, 
  TrendingUp, 
  Shield,
  Sparkles,
  DollarSign
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Ideas",
    description: "Get personalized business recommendations based on your unique skills, interests, and resources.",
    color: "primary",
  },
  {
    icon: Target,
    title: "Viability Scoring",
    description: "Each idea comes with a data-driven viability score so you know which opportunities have the best potential.",
    color: "success",
  },
  {
    icon: MapPin,
    title: "Province-Specific",
    description: "Ideas tailored to your Canadian province, including local regulations, grants, and market opportunities.",
    color: "accent",
  },
  {
    icon: DollarSign,
    title: "Budget Matched",
    description: "Filter ideas by your available startup capital, from $1K side hustles to $100K+ ventures.",
    color: "warning",
  },
  {
    icon: FileText,
    title: "Business Documents",
    description: "Generate professional business plans, pitch decks, and investor one-pagers with one click.",
    color: "primary",
  },
  {
    icon: TrendingUp,
    title: "Market Trends",
    description: "Stay ahead with real-time insights on trending industries and emerging opportunities in Canada.",
    color: "success",
  },
  {
    icon: Shield,
    title: "Verified Grants",
    description: "Access our database of Canadian grants and funding programs matched to your business type.",
    color: "accent",
  },
  {
    icon: Sparkles,
    title: "AI Business Chat",
    description: "Get instant answers to your business questions with our AI assistant trained on Canadian regulations.",
    color: "warning",
  },
];

const colorClasses = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  accent: "bg-accent/10 text-accent",
  warning: "bg-warning/10 text-warning",
};

const Features = () => {
  return (
    <section id="features" className="section-padding bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Everything You Need to{" "}
            <span className="text-gradient">Launch Your Business</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From idea generation to business registration, we provide all the tools 
            Canadian entrepreneurs need to turn their dreams into reality.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-all duration-300 card-warm hover:shadow-lg"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl ${colorClasses[feature.color as keyof typeof colorClasses]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;