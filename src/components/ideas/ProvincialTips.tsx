import { useState } from "react";
import { BusinessIdea } from "@/types/idea";
import { cn } from "@/lib/utils";
import {
  MapPin,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Building2,
  DollarSign,
  Scale,
  Users,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProvincialTipsProps {
  idea: BusinessIdea;
}

interface ProvinceTip {
  province: string;
  fullName: string;
  businessRegistration: {
    name: string;
    url: string;
    description: string;
  };
  taxInfo: {
    hstPst: string;
    corporateRate: string;
    smallBusinessRate: string;
  };
  regulations: string[];
  opportunities: string[];
  resources: Array<{ name: string; url: string }>;
  uniqueConsiderations: string[];
}

const PROVINCIAL_TIPS: Record<string, ProvinceTip> = {
  ON: {
    province: "ON",
    fullName: "Ontario",
    businessRegistration: {
      name: "ServiceOntario",
      url: "https://www.ontario.ca/page/register-business-name-online",
      description: "Register your business name online through ServiceOntario",
    },
    taxInfo: {
      hstPst: "13% HST (combined)",
      corporateRate: "11.5%",
      smallBusinessRate: "3.2% (on first $500K)",
    },
    regulations: [
      "Business name registration required ($60)",
      "HST registration if revenue exceeds $30K/year",
      "WSIB coverage may be required depending on industry",
      "Municipal business license may be needed",
    ],
    opportunities: [
      "Largest Canadian market (14.5M population)",
      "Strong tech ecosystem in Toronto-Waterloo corridor",
      "Ontario Made program for local products",
      "Access to diverse talent pool",
    ],
    resources: [
      { name: "Ontario Business Registry", url: "https://www.ontario.ca/page/business" },
      { name: "Small Business Enterprise Centres", url: "https://www.ontario.ca/page/small-business-enterprise-centres" },
      { name: "Ontario Creates (Media/Tech)", url: "https://www.ontariocreates.ca/" },
    ],
    uniqueConsiderations: [
      "High commercial rent in GTA - consider co-working or suburban locations",
      "Strong demand for bilingual services in Ottawa region",
      "Manufacturing incentives available in southwestern Ontario",
    ],
  },
  BC: {
    province: "BC",
    fullName: "British Columbia",
    businessRegistration: {
      name: "BC Registry Services",
      url: "https://www.bcregistry.ca/",
      description: "Register your business through BC Registry Services online",
    },
    taxInfo: {
      hstPst: "5% GST + 7% PST (12% combined)",
      corporateRate: "12%",
      smallBusinessRate: "2% (on first $500K)",
    },
    regulations: [
      "Business name registration ($40 for sole prop, $350 for corp)",
      "PST registration if selling taxable goods/services",
      "WorkSafeBC coverage for most industries",
      "Specific permits for food, liquor, cannabis industries",
    ],
    opportunities: [
      "Strong tech scene in Vancouver",
      "Gateway to Asia-Pacific markets",
      "Clean tech and green economy focus",
      "High tourism industry potential",
    ],
    resources: [
      { name: "Small Business BC", url: "https://smallbusinessbc.ca/" },
      { name: "Innovate BC", url: "https://innovatebc.ca/" },
      { name: "BC Business Registry", url: "https://www.bcregistry.ca/" },
    ],
    uniqueConsiderations: [
      "Very high real estate costs in Vancouver - consider Victoria or interior",
      "Strong environmental regulations - sustainability is valued",
      "Film industry creates B2B opportunities",
      "Asian language skills highly valuable in Metro Vancouver",
    ],
  },
  AB: {
    province: "AB",
    fullName: "Alberta",
    businessRegistration: {
      name: "Alberta Corporate Registry",
      url: "https://www.alberta.ca/register-business.aspx",
      description: "Register through Alberta's Corporate Registry",
    },
    taxInfo: {
      hstPst: "5% GST only (no provincial sales tax!)",
      corporateRate: "8%",
      smallBusinessRate: "2% (on first $500K)",
    },
    regulations: [
      "NUANS name search required before registration",
      "No provincial sales tax - competitive advantage",
      "WCB Alberta coverage for most industries",
      "Energy sector has specific licensing requirements",
    ],
    opportunities: [
      "No PST = lower costs for consumers and businesses",
      "Low corporate tax rates",
      "Energy transition creates new opportunities",
      "Strong agriculture and food processing sector",
    ],
    resources: [
      { name: "Business Link Alberta", url: "https://businesslink.ca/" },
      { name: "Alberta Innovates", url: "https://albertainnovates.ca/" },
      { name: "Calgary Economic Development", url: "https://calgaryeconomicdevelopment.com/" },
    ],
    uniqueConsiderations: [
      "Economy tied to oil & gas - diversification opportunities exist",
      "Lower cost of living than BC/ON - attracts talent",
      "Strong entrepreneurship culture in Calgary and Edmonton",
      "Cold climate affects some seasonal businesses",
    ],
  },
  QC: {
    province: "QC",
    fullName: "Quebec",
    businessRegistration: {
      name: "Registraire des entreprises du Québec",
      url: "https://www.registreentreprises.gouv.qc.ca/",
      description: "Register through Quebec Enterprise Register (French interface)",
    },
    taxInfo: {
      hstPst: "5% GST + 9.975% QST (14.975% combined)",
      corporateRate: "11.5%",
      smallBusinessRate: "3.2% (on first $500K)",
    },
    regulations: [
      "Bill 96: French must be predominant in commercial signage",
      "French language requirements for customer service",
      "Business registration in French",
      "QST registration if revenue exceeds $30K",
    ],
    opportunities: [
      "Strong government support for local businesses",
      "Lower cost of living than Toronto/Vancouver",
      "Vibrant creative and tech industries in Montreal",
      "Access to European markets through cultural ties",
    ],
    resources: [
      { name: "Entreprises Québec", url: "https://www.quebec.ca/entreprises-et-travailleurs-autonomes" },
      { name: "Investissement Québec", url: "https://www.investquebec.com/quebec/en/" },
      { name: "PME MTL", url: "https://pmemtl.com/en" },
    ],
    uniqueConsiderations: [
      "CRITICAL: French language requirements (Bill 96) - plan for bilingual operations",
      "Strong local preference - 'Achat Québec' movement",
      "Montreal has lower commercial rent than Toronto/Vancouver",
      "Access to unique grants not available elsewhere",
    ],
  },
  SK: {
    province: "SK",
    fullName: "Saskatchewan",
    businessRegistration: {
      name: "ISC (Information Services Corporation)",
      url: "https://www.isc.ca/BusinessServices/Pages/default.aspx",
      description: "Register through ISC online services",
    },
    taxInfo: {
      hstPst: "5% GST + 6% PST (11% combined)",
      corporateRate: "12%",
      smallBusinessRate: "1% (on first $600K) - lowest in Canada!",
    },
    regulations: [
      "Business name registration through ISC",
      "PST registration if selling taxable goods",
      "WCB Saskatchewan for most industries",
      "Agriculture businesses have specific requirements",
    ],
    opportunities: [
      "Lowest small business tax rate in Canada (1%)",
      "Strong agriculture and mining sectors",
      "Lower competition than major cities",
      "Growing Indigenous business community",
    ],
    resources: [
      { name: "Saskatchewan Business Resources", url: "https://www.saskatchewan.ca/business" },
      { name: "Innovation Saskatchewan", url: "https://innovationsask.ca/" },
    ],
    uniqueConsiderations: [
      "Smaller market - but less competition",
      "Agriculture knowledge highly valuable",
      "Resource extraction creates B2B opportunities",
      "Extreme winters affect some business models",
    ],
  },
  MB: {
    province: "MB",
    fullName: "Manitoba",
    businessRegistration: {
      name: "Manitoba Companies Office",
      url: "https://companiesoffice.gov.mb.ca/",
      description: "Register through the Companies Office online",
    },
    taxInfo: {
      hstPst: "5% GST + 7% RST (12% combined)",
      corporateRate: "12%",
      smallBusinessRate: "0% (on first $500K) - zero percent!",
    },
    regulations: [
      "Business name registration required",
      "RST registration if selling taxable goods",
      "WCB Manitoba coverage for most industries",
    ],
    opportunities: [
      "0% small business tax rate - incredible advantage",
      "Central location for national distribution",
      "Strong manufacturing sector",
      "Growing tech scene in Winnipeg",
    ],
    resources: [
      { name: "Manitoba Business", url: "https://www.gov.mb.ca/business/" },
      { name: "North Forge", url: "https://northforge.ca/" },
    ],
    uniqueConsiderations: [
      "0% provincial small business tax is major advantage",
      "Central location good for e-commerce distribution",
      "Lower cost of living attracts remote workers",
    ],
  },
  NS: {
    province: "NS",
    fullName: "Nova Scotia",
    businessRegistration: {
      name: "Nova Scotia Registry of Joint Stock Companies",
      url: "https://beta.novascotia.ca/start-business",
      description: "Register through Service Nova Scotia",
    },
    taxInfo: {
      hstPst: "15% HST (combined)",
      corporateRate: "14%",
      smallBusinessRate: "2.5% (on first $500K)",
    },
    regulations: [
      "Business name registration through Registry",
      "HST registration if revenue exceeds $30K",
      "WorkSafe NS for most industries",
    ],
    opportunities: [
      "Ocean technology hub",
      "Growing remote work destination",
      "Lower cost of living than major cities",
      "ACOA funding available",
    ],
    resources: [
      { name: "Nova Scotia Business Inc.", url: "https://www.novascotiabusiness.com/" },
      { name: "ACOA", url: "https://www.canada.ca/en/atlantic-canada-opportunities.html" },
    ],
    uniqueConsiderations: [
      "Atlantic Immigration Program brings skilled workers",
      "Remote work migration is growing Halifax",
      "Ocean economy creates unique opportunities",
    ],
  },
};

// Default tips for provinces without specific data
const DEFAULT_TIPS: Omit<ProvinceTip, "province" | "fullName"> = {
  businessRegistration: {
    name: "Provincial Registry",
    url: "https://www.canada.ca/en/services/business/start.html",
    description: "Check your provincial government website for registration details",
  },
  taxInfo: {
    hstPst: "Varies by province",
    corporateRate: "Varies",
    smallBusinessRate: "Varies",
  },
  regulations: [
    "Business name registration required",
    "GST/HST registration if revenue exceeds $30K",
    "Check provincial requirements for your industry",
  ],
  opportunities: [
    "Regional development funding available",
    "Less competition than major markets",
    "Lower operating costs",
  ],
  resources: [
    { name: "Canada Business Network", url: "https://www.canada.ca/en/services/business.html" },
    { name: "BDC", url: "https://www.bdc.ca/" },
  ],
  uniqueConsiderations: [
    "Research local market conditions",
    "Check for regional incentives and grants",
  ],
};

export const ProvincialTips = ({ idea }: ProvincialTipsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const province = idea.province || "ON"; // Default to Ontario
  const tips = PROVINCIAL_TIPS[province] || {
    ...DEFAULT_TIPS,
    province,
    fullName: province,
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <div className="font-medium text-foreground">
              {tips.fullName} Business Tips
            </div>
            <div className="text-xs text-muted-foreground">
              Provincial regulations, taxes & opportunities
            </div>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="p-4 bg-background space-y-5">
          {/* Tax Info */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              Tax Information
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded bg-muted/50 text-center">
                <div className="text-xs text-muted-foreground">Sales Tax</div>
                <div className="font-medium text-sm">{tips.taxInfo.hstPst}</div>
              </div>
              <div className="p-2 rounded bg-muted/50 text-center">
                <div className="text-xs text-muted-foreground">Corporate</div>
                <div className="font-medium text-sm">{tips.taxInfo.corporateRate}</div>
              </div>
              <div className="p-2 rounded bg-muted/50 text-center">
                <div className="text-xs text-muted-foreground">Small Biz</div>
                <div className="font-medium text-sm text-success">{tips.taxInfo.smallBusinessRate}</div>
              </div>
            </div>
          </div>

          {/* Registration */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              Business Registration
            </h4>
            <div className="p-3 rounded bg-muted/50">
              <p className="text-sm text-muted-foreground mb-2">
                {tips.businessRegistration.description}
              </p>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={tips.businessRegistration.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <ExternalLink className="w-3 h-3" />
                  {tips.businessRegistration.name}
                </a>
              </Button>
            </div>
          </div>

          {/* Regulations */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Scale className="w-4 h-4 text-warning" />
              Key Regulations
            </h4>
            <ul className="space-y-1">
              {tips.regulations.map((reg, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <AlertCircle className="w-3 h-3 mt-1 text-warning flex-shrink-0" />
                  {reg}
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-success" />
              Provincial Opportunities
            </h4>
            <ul className="space-y-1">
              {tips.opportunities.map((opp, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-success">✓</span>
                  {opp}
                </li>
              ))}
            </ul>
          </div>

          {/* Unique Considerations */}
          {tips.uniqueConsiderations.length > 0 && (
            <div className="p-3 rounded border border-primary/20 bg-primary/5">
              <h4 className="font-medium text-sm flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-primary" />
                Important for {tips.fullName}
              </h4>
              <ul className="space-y-1">
                {tips.uniqueConsiderations.map((consideration, idx) => (
                  <li key={idx} className="text-sm text-foreground">
                    • {consideration}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Resources */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Helpful Resources</h4>
            <div className="flex flex-wrap gap-2">
              {tips.resources.map((resource, idx) => (
                <Button key={idx} variant="outline" size="sm" asChild>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {resource.name}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
