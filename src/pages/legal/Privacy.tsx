import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";

const Privacy = () => {
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
              <div className="w-8 h-8 rounded-lg bg-gradient-calm flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-foreground">
                Privacy Policy
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-3xl">
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-muted-foreground">Last updated: December 26, 2025</p>

          <h2>1. Information We Collect</h2>
          <p>We collect the following types of information:</p>
          <ul>
            <li>
              <strong>Account Information:</strong> Name, email address, and password when you
              create an account.
            </li>
            <li>
              <strong>Profile Information:</strong> Province, city, skills, and business
              preferences you provide.
            </li>
            <li>
              <strong>Usage Data:</strong> Information about how you use the Service, including
              wizard responses and generated ideas.
            </li>
            <li>
              <strong>Payment Information:</strong> Processed securely through Stripe. We do not
              store credit card details.
            </li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide personalized business recommendations</li>
            <li>Improve our AI algorithms and Service</li>
            <li>Process payments and manage subscriptions</li>
            <li>Send important updates about the Service</li>
            <li>Respond to your inquiries and support requests</li>
          </ul>

          <h2>3. Data Storage and Security</h2>
          <p>
            Your data is stored securely using industry-standard encryption. We use Supabase for
            our database infrastructure, which provides enterprise-grade security and compliance.
          </p>

          <h2>4. Data Sharing</h2>
          <p>
            We do not sell your personal information. We may share data with trusted service
            providers (e.g., Stripe for payments) who help us operate the Service, subject to
            confidentiality agreements.
          </p>

          <h2>5. AI and Your Data</h2>
          <p>
            Your wizard responses are used to generate personalized recommendations. We may use
            anonymized, aggregated data to improve our AI models. Your personal information is
            never shared with third parties for AI training.
          </p>

          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and associated data</li>
            <li>Export your data in a portable format</li>
            <li>Opt out of marketing communications</li>
          </ul>

          <h2>7. Cookies</h2>
          <p>
            We use essential cookies to maintain your session and preferences. We do not use
            third-party tracking cookies or advertising cookies.
          </p>

          <h2>8. Canadian Privacy Laws</h2>
          <p>
            We comply with the Personal Information Protection and Electronic Documents Act
            (PIPEDA) and applicable provincial privacy legislation.
          </p>

          <h2>9. Children's Privacy</h2>
          <p>
            The Service is not intended for users under 18 years of age. We do not knowingly
            collect information from children.
          </p>

          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this policy periodically. We will notify you of significant changes via
            email or through the Service.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            For privacy-related questions or to exercise your rights, contact us at{" "}
            <a href="mailto:privacy@sparkbusiness.ca" className="text-primary hover:underline">
              privacy@sparkbusiness.ca
            </a>
            .
          </p>
        </article>
      </main>
    </div>
  );
};

export default Privacy;
