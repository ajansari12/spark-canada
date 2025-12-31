import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BusinessIdea } from "@/types/idea";

export type AssetType =
  | 'landing_page'
  | 'facebook_ad'
  | 'google_ad'
  | 'email_sequence'
  | 'brand_brief'
  | 'licensing_checklist';

export interface GeneratedAsset {
  assetType: AssetType;
  ideaId: string;
  ideaName: string;
  generatedAt: string;
  asset: Record<string, unknown>;
}

// Asset type metadata
export const ASSET_TYPES: Record<AssetType, { name: string; description: string; icon: string; color: string }> = {
  landing_page: {
    name: "Landing Page",
    description: "Complete landing page copy with hero, benefits, pricing, and FAQ sections",
    icon: "Layout",
    color: "text-blue-500",
  },
  facebook_ad: {
    name: "Facebook Ads",
    description: "3 ad variations with targeting recommendations for Canadian audiences",
    icon: "Facebook",
    color: "text-blue-600",
  },
  google_ad: {
    name: "Google Ads",
    description: "Search ads with headlines, descriptions, and keyword suggestions",
    icon: "Search",
    color: "text-green-500",
  },
  email_sequence: {
    name: "Email Sequence",
    description: "5-email nurture sequence with CASL compliance built-in",
    icon: "Mail",
    color: "text-purple-500",
  },
  brand_brief: {
    name: "Brand Brief",
    description: "Complete brand strategy with positioning, voice, and visual identity",
    icon: "Palette",
    color: "text-pink-500",
  },
  licensing_checklist: {
    name: "Licensing Checklist",
    description: "Federal, provincial, and municipal registration requirements",
    icon: "ClipboardCheck",
    color: "text-orange-500",
  },
};

// Local storage key for caching generated assets
const ASSETS_CACHE_KEY = 'spark_generated_assets';

// Get cached assets from local storage
const getCachedAssets = (): Record<string, GeneratedAsset[]> => {
  try {
    const cached = localStorage.getItem(ASSETS_CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch {
    return {};
  }
};

// Save asset to local storage cache
const cacheAsset = (ideaId: string, asset: GeneratedAsset) => {
  try {
    const cached = getCachedAssets();
    if (!cached[ideaId]) {
      cached[ideaId] = [];
    }
    // Replace existing asset of same type or add new
    const existingIndex = cached[ideaId].findIndex(a => a.assetType === asset.assetType);
    if (existingIndex >= 0) {
      cached[ideaId][existingIndex] = asset;
    } else {
      cached[ideaId].push(asset);
    }
    localStorage.setItem(ASSETS_CACHE_KEY, JSON.stringify(cached));
  } catch (error) {
    console.error("Failed to cache asset:", error);
  }
};

export const useIdeaBuilder = () => {
  const { toast } = useToast();
  const [currentAsset, setCurrentAsset] = useState<GeneratedAsset | null>(null);

  // Generate asset mutation
  const generateMutation = useMutation({
    mutationFn: async ({ idea, assetType }: { idea: BusinessIdea; assetType: AssetType }) => {
      const { data, error } = await supabase.functions.invoke('generate-assets', {
        body: {
          idea: {
            id: idea.id,
            name: idea.name,
            description: idea.description,
            industry: idea.industry,
            province: idea.province,
            startup_cost_min: idea.startup_cost_min,
            startup_cost_max: idea.startup_cost_max,
            monthly_revenue_min: idea.monthly_revenue_min,
            monthly_revenue_max: idea.monthly_revenue_max,
            competitors: idea.competitors,
            grants: idea.grants,
            quick_wins: idea.quick_wins,
          },
          assetType,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      return data as GeneratedAsset;
    },
    onSuccess: (asset) => {
      setCurrentAsset(asset);
      cacheAsset(asset.ideaId, asset);

      const assetInfo = ASSET_TYPES[asset.assetType];
      toast({
        title: `${assetInfo.name} Generated!`,
        description: `Your ${assetInfo.name.toLowerCase()} for "${asset.ideaName}" is ready.`,
      });
    },
    onError: (error) => {
      console.error("Asset generation error:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate asset",
      });
    },
  });

  // Get cached asset for an idea
  const getCachedAsset = (ideaId: string, assetType: AssetType): GeneratedAsset | null => {
    const cached = getCachedAssets();
    const ideaAssets = cached[ideaId] || [];
    return ideaAssets.find(a => a.assetType === assetType) || null;
  };

  // Get all cached assets for an idea
  const getIdeaAssets = (ideaId: string): GeneratedAsset[] => {
    const cached = getCachedAssets();
    return cached[ideaId] || [];
  };

  // Check if asset exists for an idea
  const hasAsset = (ideaId: string, assetType: AssetType): boolean => {
    return !!getCachedAsset(ideaId, assetType);
  };

  // Export asset as text/JSON
  const exportAsset = (asset: GeneratedAsset, format: 'json' | 'text' = 'json'): string => {
    if (format === 'json') {
      return JSON.stringify(asset, null, 2);
    }

    // Format as readable text based on asset type
    const assetInfo = ASSET_TYPES[asset.assetType];
    let text = `# ${assetInfo.name} for ${asset.ideaName}\n`;
    text += `Generated: ${new Date(asset.generatedAt).toLocaleDateString()}\n\n`;
    text += JSON.stringify(asset.asset, null, 2);
    return text;
  };

  // Copy asset to clipboard
  const copyToClipboard = async (asset: GeneratedAsset, format: 'json' | 'text' = 'json') => {
    try {
      const content = exportAsset(asset, format);
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to Clipboard",
        description: "Asset content has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
      });
    }
  };

  // Download asset as file
  const downloadAsset = (asset: GeneratedAsset, format: 'json' | 'text' = 'json') => {
    const content = exportAsset(asset, format);
    const filename = `${asset.ideaName.toLowerCase().replace(/\s+/g, '-')}-${asset.assetType}.${format === 'json' ? 'json' : 'txt'}`;

    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: `${filename} has been downloaded.`,
    });
  };

  return {
    // State
    currentAsset,
    setCurrentAsset,

    // Actions
    generateAsset: generateMutation.mutate,
    isGenerating: generateMutation.isPending,

    // Cache helpers
    getCachedAsset,
    getIdeaAssets,
    hasAsset,

    // Export helpers
    exportAsset,
    copyToClipboard,
    downloadAsset,

    // Metadata
    ASSET_TYPES,
  };
};
