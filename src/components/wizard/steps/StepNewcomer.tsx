import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Globe,
  GraduationCap,
  Briefcase,
  DollarSign,
  Building2,
  Users,
  Heart,
  FileCheck,
  ExternalLink,
  Info,
  MapPin,
  Languages,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StepNewcomerProps {
  yearsInCanada: string;
  hasCanadianExperience: boolean;
  languageLevel: string;
  credentialStatus: string;
  onYearsChange: (value: string) => void;
  onExperienceChange: (value: boolean) => void;
  onLanguageChange: (value: string) => void;
  onCredentialChange: (value: string) => void;
}

const SETTLEMENT_AGENCIES = [
  {
    name: "Immigrant Services Association of Nova Scotia (ISANS)",
    province: "Nova Scotia",
    url: "https://isans.ca",
    services: ["Employment", "Settlement", "Language"],
  },
  {
    name: "COSTI Immigrant Services",
    province: "Ontario",
    url: "https://www.costi.org",
    services: ["Employment", "Language", "Entrepreneurship"],
  },
  {
    name: "ISSofBC",
    province: "British Columbia",
    url: "https://issbc.org",
    services: ["Settlement", "Employment", "Business"],
  },
  {
    name: "Calgary Catholic Immigration Society",
    province: "Alberta",
    url: "https://www.ccisab.ca",
    services: ["Settlement", "Employment", "Integration"],
  },
  {
    name: "MOSAIC",
    province: "British Columbia",
    url: "https://mosaicbc.org",
    services: ["Employment", "Language", "Family Services"],
  },
  {
    name: "Centre for Newcomers",
    province: "Alberta",
    url: "https://www.centrefornewcomers.ca",
    services: ["Employment", "Settlement", "Youth Programs"],
  },
];

const NEWCOMER_GRANTS = [
  {
    name: "Futurpreneur Canada",
    amount: "Up to $60,000",
    description: "Loans and mentorship for entrepreneurs aged 18-39",
    eligibility: "Must have a viable business idea and be a Canadian resident",
    url: "https://www.futurpreneur.ca",
  },
  {
    name: "Start-Up Visa Program",
    amount: "Varies",
    description: "Pathway to permanent residence for immigrant entrepreneurs",
    eligibility: "Must have qualifying business and letter of support from designated organization",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa.html",
  },
  {
    name: "BDC Newcomer Loan",
    amount: "Up to $100,000",
    description: "Business Development Bank loans for newcomer entrepreneurs",
    eligibility: "Must have been in Canada for less than 5 years",
    url: "https://www.bdc.ca",
  },
  {
    name: "Immigrant Entrepreneur Fund (Various Provinces)",
    amount: "Varies by province",
    description: "Provincial programs supporting immigrant entrepreneurs",
    eligibility: "Varies by province - check provincial economic development office",
    url: "#",
  },
];

const CREDENTIAL_TIPS = [
  {
    title: "Regulated Professions",
    description: "Some professions require Canadian credentials (healthcare, engineering, law). Consider adjacent businesses that use your expertise without requiring licensing.",
    icon: FileCheck,
  },
  {
    title: "World Education Services (WES)",
    description: "Get your foreign credentials evaluated. Costs $200-$400 CAD and takes 7-20 business days.",
    icon: GraduationCap,
  },
  {
    title: "Bridging Programs",
    description: "Many provinces offer programs to help internationally trained professionals meet Canadian standards.",
    icon: Building2,
  },
  {
    title: "Alternative Pathways",
    description: "Consider consulting, training, or services that leverage your expertise without formal credential requirements.",
    icon: Briefcase,
  },
];

const StepNewcomer = ({
  yearsInCanada,
  hasCanadianExperience,
  languageLevel,
  credentialStatus,
  onYearsChange,
  onExperienceChange,
  onLanguageChange,
  onCredentialChange,
}: StepNewcomerProps) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-warm mb-4">
          <Globe className="w-8 h-8 text-white" />
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Welcome to Canada!
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Let us help you find business ideas that don't require Canadian credentials
          and are perfect for newcomers building their future here.
        </p>
      </div>

      {/* Quick Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Your Newcomer Profile
          </CardTitle>
          <CardDescription>
            Help us personalize recommendations for your situation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Years in Canada */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Time in Canada
              </Label>
              <Select value={yearsInCanada} onValueChange={onYearsChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="less-than-1">Less than 1 year</SelectItem>
                  <SelectItem value="1-2">1-2 years</SelectItem>
                  <SelectItem value="2-5">2-5 years</SelectItem>
                  <SelectItem value="5-plus">5+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Language Level */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Languages className="w-4 h-4" />
                English/French Level
              </Label>
              <Select value={languageLevel} onValueChange={onLanguageChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="native">Native/Fluent</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Credential Status */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Foreign Credential Status
            </Label>
            <Select value={credentialStatus} onValueChange={onCredentialChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-applicable">Not applicable / No formal credentials</SelectItem>
                <SelectItem value="not-evaluated">Have credentials, not yet evaluated</SelectItem>
                <SelectItem value="evaluated">Evaluated through WES or similar</SelectItem>
                <SelectItem value="recognized">Fully recognized in Canada</SelectItem>
                <SelectItem value="in-progress">In bridging program or working on recognition</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Canadian Experience */}
          <div className="flex items-center space-x-3 pt-2">
            <Checkbox
              id="canExperience"
              checked={hasCanadianExperience}
              onCheckedChange={(checked) => onExperienceChange(!!checked)}
            />
            <Label htmlFor="canExperience" className="cursor-pointer">
              I have Canadian work experience (any industry)
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Credential Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-success" />
            Credential-Free Business Opportunities
          </CardTitle>
          <CardDescription>
            Many successful businesses in Canada don't require formal credential recognition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {CREDENTIAL_TIPS.map((tip) => (
              <div
                key={tip.title}
                className="p-4 rounded-lg border border-border bg-muted/30"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <tip.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{tip.title}</h4>
                    <p className="text-xs text-muted-foreground">{tip.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Newcomer Grants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-warning" />
            Funding for Newcomer Entrepreneurs
          </CardTitle>
          <CardDescription>
            Programs specifically designed to help newcomers start businesses in Canada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {NEWCOMER_GRANTS.map((grant) => (
              <div
                key={grant.name}
                className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{grant.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {grant.amount}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{grant.description}</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Eligibility:</span> {grant.eligibility}
                    </p>
                  </div>
                  {grant.url !== "#" && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={grant.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settlement Agencies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-destructive" />
            Free Settlement Services
          </CardTitle>
          <CardDescription>
            Government-funded agencies that offer free business support and resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SETTLEMENT_AGENCIES.map((agency) => (
              <a
                key={agency.name}
                href={agency.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/30 transition-all group"
              >
                <div className="flex items-start gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <Badge variant="outline" className="text-xs">
                    {agency.province}
                  </Badge>
                </div>
                <h4 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors">
                  {agency.name}
                </h4>
                <div className="flex flex-wrap gap-1">
                  {agency.services.map((service) => (
                    <Badge key={service} variant="secondary" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>
              </a>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Find Your Local Settlement Agency</p>
                <p>
                  Visit{" "}
                  <a
                    href="https://www.cic.gc.ca/english/newcomers/services/index.asp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Immigration, Refugees and Citizenship Canada
                  </a>{" "}
                  to find free settlement services in your area, including entrepreneurship support.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Message */}
      <div className="text-center p-6 rounded-xl bg-success/10 border border-success/20">
        <Globe className="w-8 h-8 text-success mx-auto mb-3" />
        <h3 className="font-semibold text-lg mb-2">You're in the Right Place!</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          We'll prioritize business ideas that are newcomer-friendly, don't require
          Canadian credentials, and are well-suited for building your new life in Canada.
        </p>
      </div>
    </div>
  );
};

export default StepNewcomer;
