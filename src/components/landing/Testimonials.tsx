import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Founder, Maple Leaf Organics",
    location: "Vancouver, BC",
    content: "SPARK helped me discover the organic meal prep business I never knew I wanted. The province-specific grants database alone saved me $15,000 in startup costs!",
    rating: 5,
    avatar: "SC",
  },
  {
    name: "Marcus Thompson",
    role: "CEO, Northern Tech Solutions",
    location: "Toronto, ON",
    content: "As a first-time entrepreneur, I was overwhelmed. SPARK's AI chat answered all my questions about incorporating in Ontario. Launched in just 6 weeks!",
    rating: 5,
    avatar: "MT",
  },
  {
    name: "Julie Bergeron",
    role: "Owner, Artisan Boulangerie",
    location: "Montreal, QC",
    content: "The viability scoring gave me confidence to leave my corporate job. My bakery now has 3 locations and we're expanding to Ottawa next year.",
    rating: 5,
    avatar: "JB",
  },
];

const stats = [
  { value: "2,500+", label: "Ideas Generated" },
  { value: "89%", label: "User Satisfaction" },
  { value: "500+", label: "Businesses Launched" },
  { value: "10", label: "Provinces Covered" },
];

const Testimonials = () => {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-success/10 text-success text-sm font-medium mb-4">
            Success Stories
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Trusted by Canadian{" "}
            <span className="text-gradient">Entrepreneurs</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of Canadians who have turned their business dreams into reality with SPARK.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="bg-card rounded-2xl p-6 border border-border card-warm hover:shadow-lg transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-primary/20" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-warm flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-card rounded-2xl border border-border p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;