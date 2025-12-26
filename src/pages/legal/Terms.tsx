import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Scale } from "lucide-react";

const Terms = () => {
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
              <div className="w-8 h-8 rounded-lg bg-gradient-warm flex items-center justify-center">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-foreground">
                Terms of Service
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-3xl">
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-muted-foreground">Last updated: December 26, 2025</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using SPARK Business Buddy ("the Service"), you agree to be bound by
            these Terms of Service. If you do not agree to these terms, please do not use the
            Service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            SPARK Business Buddy is an AI-powered platform that helps Canadian entrepreneurs
            discover and validate business ideas. The Service provides personalized business
            recommendations, market analysis, and planning tools.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            To access certain features, you must create an account. You are responsible for
            maintaining the confidentiality of your account credentials and for all activities
            under your account.
          </p>

          <h2>4. Subscription and Payments</h2>
          <p>
            Some features require a paid subscription. Subscription fees are billed in advance on a
            monthly basis. You may cancel your subscription at any time through your account
            settings.
          </p>

          <h2>5. AI-Generated Content</h2>
          <p>
            The business ideas and recommendations provided by our AI are for informational
            purposes only. They do not constitute professional business, financial, or legal
            advice. You should consult with qualified professionals before making business
            decisions.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            SPARK Business Buddy is provided "as is" without warranties of any kind. We are not
            liable for any damages arising from your use of the Service or reliance on
            AI-generated content.
          </p>

          <h2>7. Intellectual Property</h2>
          <p>
            All content and materials on the Service, excluding user-generated content, are owned
            by SPARK Business Buddy. You retain ownership of your data and content you create.
          </p>

          <h2>8. Privacy</h2>
          <p>
            Your use of the Service is also governed by our{" "}
            <Link to="/legal/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>

          <h2>9. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account for violations of these
            terms or for any other reason at our discretion.
          </p>

          <h2>10. Changes to Terms</h2>
          <p>
            We may modify these terms at any time. Continued use of the Service after changes
            constitutes acceptance of the new terms.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These terms are governed by the laws of Canada and the province of Ontario, without
            regard to conflict of law principles.
          </p>

          <h2>12. Contact</h2>
          <p>
            For questions about these terms, please contact us at{" "}
            <a href="mailto:legal@sparkbusiness.ca" className="text-primary hover:underline">
              legal@sparkbusiness.ca
            </a>
            .
          </p>
        </article>
      </main>
    </div>
  );
};

export default Terms;
