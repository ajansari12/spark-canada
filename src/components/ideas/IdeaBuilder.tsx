import { useState } from "react";
import { BusinessIdea } from "@/types/idea";
import { useIdeaBuilder, AssetType, GeneratedAsset, ASSET_TYPES } from "@/hooks/useIdeaBuilder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Layout,
  Search,
  Mail,
  Palette,
  ClipboardCheck,
  Loader2,
  Download,
  Copy,
  Check,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Facebook icon component
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

interface IdeaBuilderProps {
  idea: BusinessIdea;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Layout,
  Facebook: FacebookIcon,
  Search,
  Mail,
  Palette,
  ClipboardCheck,
};

export const IdeaBuilder = ({ idea }: IdeaBuilderProps) => {
  const {
    generateAsset,
    isGenerating,
    getCachedAsset,
    getIdeaAssets,
    copyToClipboard,
    downloadAsset,
  } = useIdeaBuilder();

  const [selectedType, setSelectedType] = useState<AssetType | null>(null);
  const [expandedAsset, setExpandedAsset] = useState<AssetType | null>(null);

  const cachedAssets = getIdeaAssets(idea.id);
  const assetTypes = Object.entries(ASSET_TYPES) as [AssetType, typeof ASSET_TYPES[AssetType]][];

  const handleGenerate = (assetType: AssetType) => {
    setSelectedType(assetType);
    generateAsset({ idea, assetType });
  };

  const renderAssetContent = (asset: GeneratedAsset) => {
    const assetData = asset.asset;

    switch (asset.assetType) {
      case 'landing_page':
        return <LandingPagePreview data={assetData} />;
      case 'facebook_ad':
        return <FacebookAdPreview data={assetData} />;
      case 'google_ad':
        return <GoogleAdPreview data={assetData} />;
      case 'email_sequence':
        return <EmailSequencePreview data={assetData} />;
      case 'brand_brief':
        return <BrandBriefPreview data={assetData} />;
      case 'licensing_checklist':
        return <LicensingChecklistPreview data={assetData} />;
      default:
        return <pre className="text-xs">{JSON.stringify(assetData, null, 2)}</pre>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">SPARK Idea Builder</h3>
        <Badge variant="outline" className="text-xs">Canadian Context</Badge>
      </div>

      <p className="text-sm text-muted-foreground">
        Generate launch-ready assets with Canadian pricing, CASL compliance, and provincial requirements.
      </p>

      {/* Asset Type Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {assetTypes.map(([type, info]) => {
          const Icon = iconMap[info.icon] || Layout;
          const cached = getCachedAsset(idea.id, type);
          const isSelected = selectedType === type && isGenerating;

          return (
            <Card
              key={type}
              className={cn(
                "cursor-pointer transition-all hover:border-primary/50",
                cached && "border-success/30 bg-success/5"
              )}
              onClick={() => !isGenerating && handleGenerate(type)}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <Icon className={cn("w-5 h-5", info.color)} />
                  {cached && <Check className="w-4 h-4 text-success" />}
                </div>
                <h4 className="font-medium text-sm text-foreground">{info.name}</h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {info.description}
                </p>
                {isSelected && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Generating...
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Generated Assets */}
      {cachedAssets.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-border">
          <h4 className="font-medium text-foreground">Generated Assets</h4>

          {cachedAssets.map((asset) => {
            const info = ASSET_TYPES[asset.assetType];
            const Icon = iconMap[info.icon] || Layout;
            const isExpanded = expandedAsset === asset.assetType;

            return (
              <Card key={asset.assetType} className="overflow-hidden">
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => setExpandedAsset(isExpanded ? null : asset.assetType)}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={cn("w-4 h-4", info.color)} />
                    <span className="font-medium text-sm">{info.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {new Date(asset.generatedAt).toLocaleDateString()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(asset);
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadAsset(asset);
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <CardContent className="pt-0 pb-4">
                    <ScrollArea className="h-[400px] pr-4">
                      {renderAssetContent(asset)}
                    </ScrollArea>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Preview Components
function LandingPagePreview({ data }: { data: Record<string, unknown> }) {
  const hero = data.hero as Record<string, string> | undefined;
  const benefits = data.benefits as Array<Record<string, string>> | undefined;
  const howItWorks = data.howItWorks as Array<Record<string, unknown>> | undefined;
  const pricing = data.pricing as Array<Record<string, unknown>> | undefined;
  const faq = data.faq as Array<Record<string, string>> | undefined;

  return (
    <div className="space-y-4 text-sm">
      {hero && (
        <div className="p-4 bg-primary/10 rounded-lg">
          <h3 className="font-bold text-lg">{hero.headline}</h3>
          <p className="text-muted-foreground mt-1">{hero.subheadline}</p>
          <Badge className="mt-2">{hero.cta}</Badge>
        </div>
      )}

      {benefits && benefits.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Benefits</h4>
          <div className="grid grid-cols-2 gap-2">
            {benefits.map((b, i) => (
              <div key={i} className="p-2 bg-muted/50 rounded">
                <div className="font-medium">{b.title}</div>
                <div className="text-xs text-muted-foreground">{b.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {howItWorks && howItWorks.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">How It Works</h4>
          {howItWorks.map((step, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                {(step.step as number) || i + 1}
              </div>
              <div>
                <div className="font-medium">{step.title as string}</div>
                <div className="text-xs text-muted-foreground">{step.description as string}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pricing && pricing.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Pricing</h4>
          <div className="flex gap-2 overflow-x-auto">
            {pricing.map((tier, i) => (
              <div key={i} className="p-3 bg-muted/50 rounded min-w-[150px]">
                <div className="font-medium">{tier.tier as string}</div>
                <div className="text-lg font-bold text-primary">{tier.price as string}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {faq && faq.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">FAQ</h4>
          {faq.slice(0, 3).map((item, i) => (
            <div key={i} className="mb-2">
              <div className="font-medium">{item.question}</div>
              <div className="text-xs text-muted-foreground">{item.answer}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FacebookAdPreview({ data }: { data: Record<string, unknown> }) {
  const ads = data.ads as Array<Record<string, unknown>> | undefined;

  return (
    <div className="space-y-4 text-sm">
      {ads?.map((ad, i) => (
        <Card key={i} className="p-3">
          <Badge variant="outline" className="mb-2">Variation {ad.variation as string}</Badge>
          <p className="font-medium">{ad.primaryText as string}</p>
          <div className="mt-2 p-2 bg-muted/50 rounded">
            <div className="font-bold text-primary">{ad.headline as string}</div>
            <div className="text-xs text-muted-foreground">{ad.description as string}</div>
          </div>
          <div className="mt-2 text-xs">
            <span className="font-medium">CTA:</span> {ad.cta as string}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            <span className="font-medium">Image:</span> {ad.imageSuggestion as string}
          </div>
        </Card>
      ))}
      {data.budgetRecommendation && (
        <div className="p-2 bg-success/10 rounded text-success text-xs">
          Budget: {data.budgetRecommendation as string}
        </div>
      )}
    </div>
  );
}

function GoogleAdPreview({ data }: { data: Record<string, unknown> }) {
  const headlines = data.headlines as string[] | undefined;
  const descriptions = data.descriptions as string[] | undefined;
  const keywords = data.keywords as Array<Record<string, string>> | undefined;

  return (
    <div className="space-y-4 text-sm">
      <div className="p-3 border border-border rounded">
        <div className="text-xs text-muted-foreground mb-1">Ad Preview</div>
        <div className="text-primary font-medium">
          {headlines?.join(' | ')}
        </div>
        <div className="text-muted-foreground text-xs mt-1">
          {descriptions?.join(' ')}
        </div>
      </div>

      {keywords && keywords.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Keywords</h4>
          <div className="flex flex-wrap gap-1">
            {keywords.map((kw, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                [{kw.matchType}] {kw.keyword}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EmailSequencePreview({ data }: { data: Record<string, unknown> }) {
  const emails = data.emails as Array<Record<string, unknown>> | undefined;
  const casl = data.caslCompliance as Record<string, string> | undefined;

  return (
    <div className="space-y-4 text-sm">
      {casl && (
        <div className="p-2 bg-warning/10 border border-warning/20 rounded text-xs">
          <div className="font-medium text-warning mb-1">CASL Compliance</div>
          <div className="text-muted-foreground">{casl.consentNote}</div>
        </div>
      )}

      {emails?.map((email, i) => (
        <Card key={i} className="p-3">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline">Day {email.sendDay as number}</Badge>
            <span className="text-xs text-muted-foreground">{email.name as string}</span>
          </div>
          <div className="font-medium">{email.subjectLineWithEmoji as string || email.subjectLine as string}</div>
          <div className="text-xs text-muted-foreground mt-1">{email.previewText as string}</div>
          <div className="mt-2 p-2 bg-muted/50 rounded text-xs whitespace-pre-wrap">
            {(email.body as string)?.slice(0, 200)}...
          </div>
        </Card>
      ))}
    </div>
  );
}

function BrandBriefPreview({ data }: { data: Record<string, unknown> }) {
  const values = data.values as Array<Record<string, string>> | undefined;
  const taglines = data.taglines as string[] | undefined;
  const visual = data.visualIdentity as Record<string, unknown> | undefined;

  return (
    <div className="space-y-4 text-sm">
      {data.positioning && (
        <div>
          <h4 className="font-semibold mb-1">Positioning</h4>
          <p className="text-muted-foreground">{data.positioning as string}</p>
        </div>
      )}

      {data.mission && (
        <div>
          <h4 className="font-semibold mb-1">Mission</h4>
          <p className="text-muted-foreground">{data.mission as string}</p>
        </div>
      )}

      {taglines && taglines.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Tagline Options</h4>
          {taglines.map((t, i) => (
            <div key={i} className="p-2 bg-primary/10 rounded mb-1 font-medium">
              "{t}"
            </div>
          ))}
        </div>
      )}

      {values && values.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Brand Values</h4>
          <div className="flex flex-wrap gap-1">
            {values.map((v, i) => (
              <Badge key={i} variant="secondary">{v.value}</Badge>
            ))}
          </div>
        </div>
      )}

      {visual && (
        <div>
          <h4 className="font-semibold mb-2">Visual Identity</h4>
          <div className="flex gap-2">
            {(visual.primaryColors as string[])?.map((color, i) => (
              <div key={i} className="text-xs">{color}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LicensingChecklistPreview({ data }: { data: Record<string, unknown> }) {
  const federal = data.federal as Array<Record<string, string>> | undefined;
  const provincial = data.provincial as Array<Record<string, string>> | undefined;
  const insurance = data.insurance as Array<Record<string, unknown>> | undefined;

  return (
    <div className="space-y-4 text-sm">
      {data.totalEstimatedCost && (
        <div className="p-2 bg-warning/10 rounded text-warning font-medium">
          Total Estimated Cost: {data.totalEstimatedCost as string}
        </div>
      )}

      {federal && federal.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Federal Requirements</h4>
          {federal.map((item, i) => (
            <div key={i} className="flex items-start gap-2 mb-2 p-2 bg-muted/50 rounded">
              <ClipboardCheck className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">{item.item}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
                {item.website && (
                  <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1 mt-1">
                    Visit Website <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {provincial && provincial.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Provincial Requirements</h4>
          {provincial.map((item, i) => (
            <div key={i} className="flex items-start gap-2 mb-2 p-2 bg-muted/50 rounded">
              <ClipboardCheck className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">{item.item}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {insurance && insurance.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Insurance</h4>
          {insurance.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-muted/50 rounded mb-1">
              <span className="font-medium">{item.type as string}</span>
              <span className="text-xs text-muted-foreground">{item.estimatedAnnualCost as string}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
