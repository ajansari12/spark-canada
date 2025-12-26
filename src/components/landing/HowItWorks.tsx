import { ClipboardList, Cpu, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Tell Us About Yourself",
    description: "Complete our fun, visual wizard. Share your skills, budget, time commitment, and which Canadian province you're in. Takes just 5 minutes!",
    color: "primary",
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI Generates Ideas",
    description: "Our AI analyzes your profile against thousands of successful Canadian businesses and market trends to generate personalized recommendations.",
    color: "accent",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Launch Your Business",
    description: "Pick your favorite idea, download your business plan, and follow our step-by-step registration guide tailored to your province.",
    color: "success",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            From Idea to Launch in{" "}
            <span className="text-gradient">Three Simple Steps</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our streamlined process makes it easy to discover, validate, and 
            launch your perfect Canadian business.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-gradient-to-r from-primary via-accent to-success" />

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative text-center group"
              >
                {/* Step Number Badge */}
                <div className="relative inline-flex mb-8">
                  <div className={`
                    w-20 h-20 rounded-2xl flex items-center justify-center
                    ${step.color === 'primary' ? 'bg-primary/10' : ''}
                    ${step.color === 'accent' ? 'bg-accent/10' : ''}
                    ${step.color === 'success' ? 'bg-success/10' : ''}
                    group-hover:scale-110 transition-transform duration-300
                  `}>
                    <step.icon className={`
                      w-10 h-10
                      ${step.color === 'primary' ? 'text-primary' : ''}
                      ${step.color === 'accent' ? 'text-accent' : ''}
                      ${step.color === 'success' ? 'text-success' : ''}
                    `} />
                  </div>
                  <span className={`
                    absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center
                    font-display font-bold text-sm text-white
                    ${step.color === 'primary' ? 'bg-primary' : ''}
                    ${step.color === 'accent' ? 'bg-accent' : ''}
                    ${step.color === 'success' ? 'bg-success' : ''}
                  `}>
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-display font-bold text-xl text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  {step.description}
                </p>

                {/* Arrow - Mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-6">
                    <div className="w-0.5 h-8 bg-border" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;