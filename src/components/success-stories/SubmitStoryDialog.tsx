import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSuccessStories } from "@/hooks/useSuccessStories";
import { useIdeas } from "@/hooks/useIdeas";
import { Loader2, Sparkles } from "lucide-react";

const PROVINCES = [
  { value: "ON", label: "Ontario" },
  { value: "BC", label: "British Columbia" },
  { value: "AB", label: "Alberta" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "MB", label: "Manitoba" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NB", label: "New Brunswick" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "NL", label: "Newfoundland & Labrador" },
];

const INDUSTRIES = [
  "Food & Beverage",
  "Technology",
  "Health & Wellness",
  "Retail & E-commerce",
  "Creative Services",
  "Education & Training",
  "Real Estate",
  "Professional Services",
  "Home Services",
  "Pet Services",
  "Tourism & Hospitality",
  "Sustainability",
  "Automotive",
  "Beauty & Personal Care",
  "Finance & Insurance",
  "Manufacturing",
  "AI & Automation",
  "Content Creation",
  "Mental Health",
  "Elder Care",
];

const AI_TOOLS = [
  "ChatGPT",
  "Claude",
  "Midjourney",
  "DALL-E",
  "Copilot",
  "Canva AI",
  "Jasper",
  "Copy.ai",
  "Other",
];

interface SubmitStoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubmitStoryDialog({ open, onOpenChange }: SubmitStoryDialogProps) {
  const { submitStory, isSubmitting } = useSuccessStories();
  const { allIdeas } = useIdeas();

  const [formData, setFormData] = useState({
    title: "",
    story: "",
    quote: "",
    business_name: "",
    industry: "",
    province: "",
    city: "",
    startup_cost: "",
    monthly_revenue: "",
    time_to_first_sale: "",
    employees_count: "1",
    is_side_hustle: false,
    is_newcomer: false,
    ai_tools_used: [] as string[],
    idea_id: "",
    spark_helped: true,
    website_url: "",
    display_name: "",
    is_anonymous: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    submitStory({
      title: formData.title,
      story: formData.story,
      quote: formData.quote || undefined,
      business_name: formData.business_name,
      industry: formData.industry,
      province: formData.province,
      city: formData.city || undefined,
      startup_cost: formData.startup_cost ? parseInt(formData.startup_cost) : undefined,
      monthly_revenue: formData.monthly_revenue ? parseInt(formData.monthly_revenue) : undefined,
      time_to_first_sale: formData.time_to_first_sale || undefined,
      employees_count: parseInt(formData.employees_count) || 1,
      is_side_hustle: formData.is_side_hustle,
      is_newcomer: formData.is_newcomer,
      ai_tools_used: formData.ai_tools_used.length > 0 ? formData.ai_tools_used : undefined,
      idea_id: formData.idea_id || undefined,
      spark_helped: formData.spark_helped,
      website_url: formData.website_url || undefined,
      display_name: formData.display_name || undefined,
      is_anonymous: formData.is_anonymous,
    });

    // Reset form and close dialog
    setFormData({
      title: "",
      story: "",
      quote: "",
      business_name: "",
      industry: "",
      province: "",
      city: "",
      startup_cost: "",
      monthly_revenue: "",
      time_to_first_sale: "",
      employees_count: "1",
      is_side_hustle: false,
      is_newcomer: false,
      ai_tools_used: [],
      idea_id: "",
      spark_helped: true,
      website_url: "",
      display_name: "",
      is_anonymous: false,
    });
    onOpenChange(false);
  };

  const toggleAiTool = (tool: string) => {
    setFormData((prev) => ({
      ...prev,
      ai_tools_used: prev.ai_tools_used.includes(tool)
        ? prev.ai_tools_used.filter((t) => t !== tool)
        : [...prev.ai_tools_used, tool],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Share Your Success Story
          </DialogTitle>
          <DialogDescription>
            Inspire other Canadian entrepreneurs by sharing how you turned your business idea into
            reality. Your story will be reviewed before publishing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="business_name">Business Name *</Label>
                <Input
                  id="business_name"
                  value={formData.business_name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, business_name: e.target.value }))
                  }
                  placeholder="Your business name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Select
                  value={formData.industry}
                  onValueChange={(v) => setFormData((prev) => ({ ...prev, industry: v }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="province">Province *</Label>
                <Select
                  value={formData.province}
                  onValueChange={(v) => setFormData((prev) => ({ ...prev, province: v }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES.map((province) => (
                      <SelectItem key={province.value} value={province.value}>
                        {province.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                  placeholder="Your city"
                />
              </div>
            </div>
          </div>

          {/* Story Content */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Story Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., From Side Hustle to Full-Time in 6 Months"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="story">Your Story *</Label>
              <Textarea
                id="story"
                value={formData.story}
                onChange={(e) => setFormData((prev) => ({ ...prev, story: e.target.value }))}
                placeholder="Share your journey - what inspired you, challenges you faced, and how you overcame them..."
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quote">Featured Quote</Label>
              <Input
                id="quote"
                value={formData.quote}
                onChange={(e) => setFormData((prev) => ({ ...prev, quote: e.target.value }))}
                placeholder="A short, inspiring quote from your story"
              />
              <p className="text-xs text-muted-foreground">
                This may be featured on our homepage
              </p>
            </div>
          </div>

          {/* Metrics */}
          <div className="space-y-4">
            <Label className="text-base">Business Metrics (Optional)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startup_cost" className="text-xs">
                  Startup Cost ($)
                </Label>
                <Input
                  id="startup_cost"
                  type="number"
                  value={formData.startup_cost}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, startup_cost: e.target.value }))
                  }
                  placeholder="5000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly_revenue" className="text-xs">
                  Monthly Revenue ($)
                </Label>
                <Input
                  id="monthly_revenue"
                  type="number"
                  value={formData.monthly_revenue}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, monthly_revenue: e.target.value }))
                  }
                  placeholder="10000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time_to_first_sale" className="text-xs">
                  Time to First Sale
                </Label>
                <Input
                  id="time_to_first_sale"
                  value={formData.time_to_first_sale}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, time_to_first_sale: e.target.value }))
                  }
                  placeholder="2 weeks"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employees_count" className="text-xs">
                  Team Size
                </Label>
                <Input
                  id="employees_count"
                  type="number"
                  value={formData.employees_count}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, employees_count: e.target.value }))
                  }
                  placeholder="1"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_side_hustle"
                  checked={formData.is_side_hustle}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_side_hustle: checked === true }))
                  }
                />
                <Label htmlFor="is_side_hustle" className="text-sm">
                  Started as a side hustle
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_newcomer"
                  checked={formData.is_newcomer}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_newcomer: checked === true }))
                  }
                />
                <Label htmlFor="is_newcomer" className="text-sm">
                  I'm a newcomer to Canada
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="spark_helped"
                  checked={formData.spark_helped}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, spark_helped: checked === true }))
                  }
                />
                <Label htmlFor="spark_helped" className="text-sm">
                  SPARK helped me find/validate this idea
                </Label>
              </div>
            </div>
          </div>

          {/* AI Tools */}
          <div className="space-y-2">
            <Label>AI Tools Used (Optional)</Label>
            <div className="flex flex-wrap gap-2">
              {AI_TOOLS.map((tool) => (
                <Button
                  key={tool}
                  type="button"
                  variant={formData.ai_tools_used.includes(tool) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleAiTool(tool)}
                >
                  {tool}
                </Button>
              ))}
            </div>
          </div>

          {/* SPARK Connection */}
          {allIdeas.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="idea_id">Link to SPARK Idea (Optional)</Label>
              <Select
                value={formData.idea_id}
                onValueChange={(v) => setFormData((prev) => ({ ...prev, idea_id: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your SPARK idea" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {allIdeas.map((idea) => (
                    <SelectItem key={idea.id} value={idea.id}>
                      {idea.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Display Preferences */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, display_name: e.target.value }))
                  }
                  placeholder="Your name (optional)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website_url">Website URL</Label>
                <Input
                  id="website_url"
                  type="url"
                  value={formData.website_url}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, website_url: e.target.value }))
                  }
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_anonymous"
                checked={formData.is_anonymous}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_anonymous: checked === true }))
                }
              />
              <Label htmlFor="is_anonymous" className="text-sm">
                Share my story anonymously
              </Label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Submit Story
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
