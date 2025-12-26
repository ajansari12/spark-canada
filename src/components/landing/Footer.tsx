import { Link } from "react-router-dom";
import { Sparkles, Twitter, Linkedin, Youtube, Mail } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "/pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "Blog", href: "/blog" },
  ],
  resources: [
    { label: "Business Guides", href: "/guides" },
    { label: "Grant Database", href: "/grants" },
    { label: "Market Trends", href: "/trends" },
    { label: "Success Stories", href: "/stories" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
    { label: "Partners", href: "/partners" },
  ],
  legal: [
    { label: "Terms of Service", href: "/legal/terms" },
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Disclaimer", href: "/legal/disclaimer" },
    { label: "Cookie Policy", href: "/legal/cookies" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/sparkbusiness", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com/company/sparkbusiness", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com/@sparkbusiness", label: "YouTube" },
  { icon: Mail, href: "mailto:hello@sparkbusinessbuddy.com", label: "Email" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-warm flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-bold text-xl text-foreground">
                  SPARK
                </span>
              </Link>
              <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                AI-powered business idea generator for Canadian entrepreneurs. 
                Discover, validate, and launch your perfect business.
              </p>
              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-display font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="font-display font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-display font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-display font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {currentYear} SPARK Business Buddy. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            Made with ❤️ for Canadian entrepreneurs 🇨🇦
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;