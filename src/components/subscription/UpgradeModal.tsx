import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Crown, Check } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

const proFeatures = [
  "Unlimited idea generations",
  "Export PDF business plans",
  "AI-powered chat assistance",
  "Priority support",
  "Access to grants database",
];

export const UpgradeModal = ({ isOpen, onClose, feature }: UpgradeModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-16 h-16 rounded-2xl bg-gradient-warm flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Upgrade to Pro
          </DialogTitle>
          <DialogDescription className="text-center">
            {feature
              ? `Unlock "${feature}" and get unlimited access to all SPARK features.`
              : "You've reached your free generation limit. Upgrade to continue generating ideas."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-muted/50 rounded-xl p-4 mb-4">
            <div className="text-center mb-4">
              <span className="text-3xl font-display font-bold text-foreground">
                $29
              </span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3">
              {proFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center">
                    <Check className="w-3 h-3 text-success" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button asChild className="btn-gradient w-full gap-2">
            <Link to="/pricing">
              <Sparkles className="w-4 h-4" />
              View Pricing Plans
            </Link>
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
