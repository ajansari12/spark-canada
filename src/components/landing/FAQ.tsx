import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the AI generate business ideas?",
    answer: "Our AI analyzes your skills, interests, budget, location, and time commitment against our database of successful Canadian businesses and current market trends. It considers factors like local competition, provincial regulations, available grants, and industry growth rates to generate personalized recommendations with viability scores.",
  },
  {
    question: "Are the business ideas specific to my Canadian province?",
    answer: "Yes! Each idea is tailored to your selected province or territory. We consider local market conditions, provincial regulations, available grants and funding programs, and regional economic opportunities. You'll also get province-specific registration guides and tax information.",
  },
  {
    question: "What's included in the viability score?",
    answer: "The viability score (0-100) is calculated based on market demand, competition level, startup costs relative to your budget, skills match, provincial opportunity, and current industry trends. A score above 70 indicates strong potential, while scores above 85 are exceptional opportunities.",
  },
  {
    question: "Can I export my business plan?",
    answer: "Pro and Enterprise users can export professional business plans as PDF documents. This includes executive summary, market analysis, financial projections, and operational plans. You can also generate investor one-pagers and pitch deck presentations.",
  },
  {
    question: "How accurate is the grants database?",
    answer: "Our grants database is updated weekly and includes federal and provincial programs. Each grant listing includes eligibility requirements, application deadlines, and direct links to official sources. We verify all grants against government databases to ensure accuracy.",
  },
  {
    question: "Can I try SPARK for free?",
    answer: "Absolutely! Our free plan includes 3 AI idea generations, basic viability scoring, and access to our community. No credit card required. You can upgrade to Pro anytime for unlimited generations and advanced features.",
  },
  {
    question: "What if I'm not satisfied with my subscription?",
    answer: "We offer a 30-day money-back guarantee on all paid plans. If you're not completely satisfied, contact our support team within 30 days of purchase for a full refund. No questions asked.",
  },
  {
    question: "Do you offer support for French-speaking entrepreneurs?",
    answer: "Yes! Our platform supports both English and French. Quebec entrepreneurs will receive ideas and resources in French, including QC-specific business registration guides and provincial grant information.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="section-padding bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Frequently Asked{" "}
            <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about SPARK Business Buddy.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl border border-border px-6 data-[state=open]:border-primary/30 transition-colors"
              >
                <AccordionTrigger className="text-left font-display font-semibold text-foreground hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <a href="mailto:support@sparkbusinessbuddy.com" className="text-primary hover:underline font-medium">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;