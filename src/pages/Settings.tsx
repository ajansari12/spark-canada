import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription, SUBSCRIPTION_TIERS } from "@/hooks/useSubscription";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppHeader } from "@/components/layout/AppHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings as SettingsIcon,
  User,
  CreditCard,
  Crown,
  Loader2,
  Check,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const PROVINCES = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Yukon",
];

interface ProfileData {
  full_name: string;
  email: string;
  province: string;
  city: string;
}

const Settings = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { tier, subscribed, subscriptionEnd, openCustomerPortal, loading: subLoading } = useSubscription();
  const { usage, FREE_GENERATION_LIMIT } = useUsageLimits();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<ProfileData>({
    full_name: "",
    email: "",
    province: "",
    city: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, email, province, city")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setProfile({
          full_name: data.full_name || "",
          email: data.email || user.email || "",
          province: data.province || "",
          city: data.city || "",
        });
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          province: profile.province,
          city: profile.city,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsPortalLoading(true);
    try {
      await openCustomerPortal();
    } catch (error) {
      console.error("Error opening portal:", error);
      toast.error("Failed to open subscription manager");
    } finally {
      setIsPortalLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-warm flex items-center justify-center mx-auto mb-4 animate-pulse">
            <SettingsIcon className="w-8 h-8 text-white" />
          </div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const currentTierConfig = SUBSCRIPTION_TIERS[tier];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Sub-header with page info */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-warm flex items-center justify-center">
                <SettingsIcon className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-foreground">
                Settings
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-3xl">
        <div className="space-y-6">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile
              </CardTitle>
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.full_name}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, full_name: e.target.value }))
                    }
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={profile.email}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="province">Province</Label>
                  <Select
                    value={profile.province}
                    onValueChange={(value) =>
                      setProfile((prev) => ({ ...prev, province: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINCES.map((prov) => (
                        <SelectItem key={prov} value={prov}>
                          {prov}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profile.city}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, city: e.target.value }))
                    }
                    placeholder="Your city"
                  />
                </div>
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Subscription Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Subscription
              </CardTitle>
              <CardDescription>
                Manage your plan and billing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl border-2 border-primary/20 bg-primary/5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-warm flex items-center justify-center">
                      {tier === "free" ? (
                        <Sparkles className="w-5 h-5 text-white" />
                      ) : (
                        <Crown className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {currentTierConfig.name} Plan
                      </h3>
                      {subscriptionEnd && (
                        <p className="text-sm text-muted-foreground">
                          Renews {format(new Date(subscriptionEnd), "MMM d, yyyy")}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-2xl font-display font-bold text-foreground">
                    ${currentTierConfig.price}
                    <span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </span>
                </div>

                {tier === "free" && (
                  <div className="mb-4 p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Idea generations this month
                      </span>
                      <span className="font-medium text-foreground">
                        {usage.idea_generation_count} / {FREE_GENERATION_LIMIT}
                      </span>
                    </div>
                    <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{
                          width: `${(usage.idea_generation_count / FREE_GENERATION_LIMIT) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                <ul className="space-y-2 mb-4">
                  {currentTierConfig.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex gap-3">
                  {subscribed ? (
                    <Button
                      variant="outline"
                      onClick={handleManageSubscription}
                      disabled={isPortalLoading}
                      className="gap-2"
                    >
                      {isPortalLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      Manage Subscription
                    </Button>
                  ) : (
                    <Button asChild className="btn-gradient gap-2">
                      <Link to="/pricing">
                        <Crown className="w-4 h-4" />
                        Upgrade to Pro
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Section */}
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Manage your account settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={handleSignOut}>
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
