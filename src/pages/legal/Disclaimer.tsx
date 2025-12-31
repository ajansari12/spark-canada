import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2 ml-4">
              <div className="w-8 h-8 rounded-lg bg-warning flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-warning-foreground" />
              </div>
              <span className="font-display font-bold text-lg text-foreground">
                Business Disclaimer
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-3xl">
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-muted-foreground">Last updated: December 26, 2025</p>

          <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg mb-8">
            <p className="text-foreground font-medium mb-0">
              <strong>Important:</strong> The information provided by SPARK Business Buddy is for
              general informational purposes only and does not constitute professional advice.
            </p>
          </div>

          <h2>1. Not Professional Advice</h2>
          <p>
            SPARK Business Buddy provides AI-generated business ideas and recommendations.{" "}
            <strong>This content is not:</strong>
          </p>
          <ul>
            <li>Legal advice</li>
            <li>Financial or investment advice</li>
            <li>Tax advice</li>
            <li>Professional business consulting</li>
          </ul>
          <p>
            Always consult with qualified professionals (lawyers, accountants, business advisors)
            before making significant business decisions.
          </p>

          <h2>2. No Guarantees</h2>
          <p>
            We do not guarantee the accuracy, completeness, or success of any business idea or
            recommendation. Market conditions, regulations, and other factors change constantly.
            Past performance or AI predictions do not guarantee future results.
          </p>

          <h2>3. Your Responsibility</h2>
          <p>
            You are solely responsible for evaluating the suitability of any business idea for
            your specific situation. This includes:
          </p>
          <ul>
            <li>Conducting your own market research</li>
            <li>Verifying all information independently</li>
            <li>Understanding applicable laws and regulations</li>
            <li>Assessing your personal financial situation</li>
            <li>Obtaining necessary licenses and permits</li>
          </ul>

          <h2>4. AI Limitations</h2>
          <p>
            Our AI-generated content may contain inaccuracies or be outdated. The AI does not have
            access to real-time market data or your complete personal circumstances. Treat all AI
            suggestions as starting points for further research, not definitive recommendations.
          </p>

          <h2>5. Financial Risk</h2>
          <p>
            Starting a business involves financial risk. You may lose some or all of your
            investment. Never invest money you cannot afford to lose. The revenue projections and
            cost estimates provided are illustrative only and should not be relied upon for
            financial planning.
          </p>

          <h2>6. Canadian Context</h2>
          <p>
            While we focus on the Canadian market, business regulations vary by province and
            municipality. Grant and funding information may change without notice. Always verify
            eligibility requirements directly with the issuing organization.
          </p>

          <h2>7. Third-Party Resources</h2>
          <p>
            We may link to or reference external resources, grants, or organizations. We are not
            affiliated with these entities and do not guarantee the accuracy of information about
            them.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, SPARK Business Buddy and its operators are not
            liable for any damages or losses arising from your use of the Service or any business
            decisions made based on our content.
          </p>

          <h2>9. Questions</h2>
          <p>
            If you have questions about this disclaimer, please contact us at{" "}
            <a href="mailto:info@sparkbusiness.ca" className="text-primary hover:underline">
              info@sparkbusiness.ca
            </a>
            .
          </p>
        </article>
      </main>
    </div>
  );
};

export default Disclaimer;
