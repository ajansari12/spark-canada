import { useState, useMemo } from "react";
import { BusinessIdea } from "@/types/idea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Calendar,
  PiggyBank,
  Wallet,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RunwayCalculatorProps {
  idea: BusinessIdea;
}

interface RunwayResult {
  monthsToBreakeven: number;
  totalInvestmentNeeded: number;
  monthlyBurnRate: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  milestones: Array<{
    month: number;
    event: string;
    cashPosition: number;
  }>;
}

export const RunwayCalculator = ({ idea }: RunwayCalculatorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [savings, setSavings] = useState(10000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(3000);
  const [investmentAmount, setInvestmentAmount] = useState(idea.startup_cost_min || 5000);

  // Calculate runway and projections
  const result = useMemo((): RunwayResult => {
    const startupCost = idea.startup_cost_min || 5000;
    const monthlyRevenueMin = idea.monthly_revenue_min || 2000;
    const monthlyRevenueMax = idea.monthly_revenue_max || 5000;

    // Assume gradual revenue ramp-up
    // Month 1-2: 0% revenue (setup phase)
    // Month 3-4: 25% of min revenue
    // Month 5-6: 50% of min revenue
    // Month 7+: 75%-100% of min revenue

    const projectedMonthlyRevenue = [
      0, 0, // Months 1-2: Setup
      monthlyRevenueMin * 0.25, monthlyRevenueMin * 0.25, // Months 3-4
      monthlyRevenueMin * 0.5, monthlyRevenueMin * 0.5, // Months 5-6
      monthlyRevenueMin * 0.75, monthlyRevenueMin * 0.75, // Months 7-8
      monthlyRevenueMin * 0.9, monthlyRevenueMin * 0.9, // Months 9-10
      monthlyRevenueMin, monthlyRevenueMin, // Months 11-12
    ];

    // Calculate monthly cash flow
    let cashPosition = savings - investmentAmount;
    let monthsToBreakeven = -1;
    const milestones: RunwayResult["milestones"] = [];

    // Track key milestones
    milestones.push({
      month: 0,
      event: "Initial Investment",
      cashPosition: savings - investmentAmount,
    });

    for (let month = 1; month <= 24; month++) {
      const revenue = month <= 12
        ? projectedMonthlyRevenue[month - 1]
        : monthlyRevenueMin; // After year 1, assume min revenue

      const netCashFlow = revenue - monthlyExpenses;
      cashPosition += netCashFlow;

      // Track first revenue milestone
      if (month === 3) {
        milestones.push({
          month,
          event: "First Revenue",
          cashPosition,
        });
      }

      // Track breakeven
      if (monthsToBreakeven === -1 && netCashFlow >= 0) {
        monthsToBreakeven = month;
        milestones.push({
          month,
          event: "Break-even Reached",
          cashPosition,
        });
      }

      // Track if running out of money
      if (cashPosition < 0 && milestones[milestones.length - 1].event !== "Out of Runway") {
        milestones.push({
          month,
          event: "Out of Runway",
          cashPosition,
        });
      }
    }

    // Add 12-month milestone if we made it
    if (cashPosition > 0) {
      milestones.push({
        month: 12,
        event: "Year 1 Complete",
        cashPosition,
      });
    }

    // Calculate total investment needed to reach breakeven
    let totalInvestmentNeeded = investmentAmount;
    let tempCash = savings - investmentAmount;
    for (let month = 1; month <= (monthsToBreakeven > 0 ? monthsToBreakeven : 12); month++) {
      const revenue = month <= 12
        ? projectedMonthlyRevenue[month - 1]
        : monthlyRevenueMin;
      tempCash += revenue - monthlyExpenses;
      if (tempCash < 0) {
        totalInvestmentNeeded += Math.abs(tempCash);
        tempCash = 0;
      }
    }

    // Determine risk level
    const monthsOfRunway = savings / monthlyExpenses;
    let riskLevel: RunwayResult["riskLevel"] = "low";

    if (monthsToBreakeven === -1 || monthsToBreakeven > 18) {
      riskLevel = "critical";
    } else if (monthsToBreakeven > 12 || monthsOfRunway < monthsToBreakeven) {
      riskLevel = "high";
    } else if (monthsToBreakeven > 6 || monthsOfRunway < monthsToBreakeven + 3) {
      riskLevel = "medium";
    }

    return {
      monthsToBreakeven: monthsToBreakeven === -1 ? 24 : monthsToBreakeven,
      totalInvestmentNeeded,
      monthlyBurnRate: monthlyExpenses - (monthlyRevenueMin * 0.5),
      riskLevel,
      milestones: milestones.slice(0, 5), // Keep top 5 milestones
    };
  }, [savings, monthlyExpenses, investmentAmount, idea]);

  const getRiskColor = (level: RunwayResult["riskLevel"]) => {
    switch (level) {
      case "low":
        return "text-success";
      case "medium":
        return "text-warning";
      case "high":
        return "text-orange-500";
      case "critical":
        return "text-destructive";
    }
  };

  const getRiskBg = (level: RunwayResult["riskLevel"]) => {
    switch (level) {
      case "low":
        return "bg-success/10";
      case "medium":
        return "bg-warning/10";
      case "high":
        return "bg-orange-500/10";
      case "critical":
        return "bg-destructive/10";
    }
  };

  const getRiskIcon = (level: RunwayResult["riskLevel"]) => {
    switch (level) {
      case "low":
        return CheckCircle2;
      case "medium":
        return TrendingUp;
      case "high":
        return TrendingDown;
      case "critical":
        return AlertTriangle;
    }
  };

  const getRiskLabel = (level: RunwayResult["riskLevel"]) => {
    switch (level) {
      case "low":
        return "Low Risk - Good cushion";
      case "medium":
        return "Medium Risk - Plan carefully";
      case "high":
        return "High Risk - Consider saving more";
      case "critical":
        return "Critical - May need more funding";
    }
  };

  const formatCurrency = (value: number): string => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const RiskIcon = getRiskIcon(result.riskLevel);

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <div className="font-medium text-foreground">Financial Runway Calculator</div>
            <div className="text-xs text-muted-foreground">
              Estimate time to profitability
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn("px-2 py-1 rounded-full text-xs font-medium", getRiskBg(result.riskLevel), getRiskColor(result.riskLevel))}>
            {result.monthsToBreakeven} months to break-even
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="p-4 bg-background space-y-6">
          {/* Input section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <PiggyBank className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="savings" className="text-sm">Available Savings</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Your total liquid savings you can use for this venture</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="savings"
                  type="number"
                  value={savings}
                  onChange={(e) => setSavings(Number(e.target.value))}
                  className="pl-8"
                  min={0}
                  step={1000}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="expenses" className="text-sm">Monthly Expenses</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Your personal monthly living expenses (rent, food, bills, etc.)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="expenses"
                  type="number"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                  className="pl-8"
                  min={0}
                  step={500}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="investment" className="text-sm">Initial Investment</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">How much you plan to invest upfront in the business</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="investment"
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  className="pl-8"
                  min={0}
                  step={1000}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Suggested: {formatCurrency(idea.startup_cost_min || 0)} - {formatCurrency(idea.startup_cost_max || 0)}
              </div>
            </div>
          </div>

          {/* Results section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={cn("p-3 rounded-lg text-center", getRiskBg(result.riskLevel))}>
              <RiskIcon className={cn("w-6 h-6 mx-auto mb-1", getRiskColor(result.riskLevel))} />
              <div className={cn("font-bold text-lg", getRiskColor(result.riskLevel))}>
                {result.monthsToBreakeven} mo
              </div>
              <div className="text-xs text-muted-foreground">To Break-even</div>
            </div>

            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <DollarSign className="w-6 h-6 mx-auto mb-1 text-primary" />
              <div className="font-bold text-lg text-foreground">
                {formatCurrency(result.totalInvestmentNeeded)}
              </div>
              <div className="text-xs text-muted-foreground">Total Investment</div>
            </div>

            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <Calendar className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
              <div className="font-bold text-lg text-foreground">
                {Math.floor(savings / monthlyExpenses)} mo
              </div>
              <div className="text-xs text-muted-foreground">Personal Runway</div>
            </div>

            <div className={cn("p-3 rounded-lg text-center", getRiskBg(result.riskLevel))}>
              <div className="font-bold text-sm mb-1">{result.riskLevel.toUpperCase()}</div>
              <div className="text-xs text-muted-foreground">
                {getRiskLabel(result.riskLevel)}
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-foreground">Key Milestones</h4>
            <div className="space-y-1">
              {result.milestones.map((milestone, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex items-center justify-between p-2 rounded text-sm",
                    milestone.cashPosition < 0 ? "bg-destructive/10" : "bg-muted/30"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                      milestone.cashPosition < 0 ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"
                    )}>
                      {milestone.month}
                    </span>
                    <span className="text-muted-foreground">Month {milestone.month}:</span>
                    <span className="font-medium">{milestone.event}</span>
                  </div>
                  <span className={cn(
                    "font-medium",
                    milestone.cashPosition < 0 ? "text-destructive" : "text-success"
                  )}>
                    {milestone.cashPosition >= 0 ? "+" : ""}{formatCurrency(milestone.cashPosition)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {result.riskLevel !== "low" && (
            <div className={cn("p-3 rounded-lg", getRiskBg(result.riskLevel))}>
              <h4 className={cn("font-medium text-sm mb-2", getRiskColor(result.riskLevel))}>
                Recommendations
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                {result.riskLevel === "critical" && (
                  <>
                    <li>• Consider saving more before starting</li>
                    <li>• Look for grants or funding (check Grants tab)</li>
                    <li>• Start as a side hustle to reduce risk</li>
                  </>
                )}
                {result.riskLevel === "high" && (
                  <>
                    <li>• Build an emergency fund of 3+ months expenses</li>
                    <li>• Consider starting part-time first</li>
                    <li>• Look for ways to reduce startup costs</li>
                  </>
                )}
                {result.riskLevel === "medium" && (
                  <>
                    <li>• Create a detailed budget and stick to it</li>
                    <li>• Focus on quick revenue generation</li>
                    <li>• Have a backup plan if things take longer</li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
