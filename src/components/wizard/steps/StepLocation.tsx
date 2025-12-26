import { useState } from "react";
import { PROVINCES } from "@/types/wizard";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepLocationProps {
  province: string;
  city?: string;
  onChange: (province: string, city?: string) => void;
}

const regionLabels = {
  west: "Western Canada",
  central: "Central Canada",
  atlantic: "Atlantic Canada",
  north: "Northern Territories",
};

const regionOrder = ['west', 'central', 'atlantic', 'north'] as const;

const StepLocation = ({ province, city, onChange }: StepLocationProps) => {
  const [cityInput, setCityInput] = useState(city || "");

  const handleProvinceSelect = (code: string) => {
    onChange(code, cityInput);
  };

  const handleCityChange = (value: string) => {
    setCityInput(value);
    onChange(province, value);
  };

  const groupedProvinces = regionOrder.map((region) => ({
    region,
    label: regionLabels[region],
    provinces: PROVINCES.filter((p) => p.region === region),
  }));

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Where are you located?
        </h2>
        <p className="text-muted-foreground">
          We'll tailor recommendations to your province's market and regulations
        </p>
      </div>

      {/* Province Selection */}
      <div className="space-y-6 mb-8">
        {groupedProvinces.map((group) => (
          <div key={group.region}>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              {group.label}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {group.provinces.map((prov) => {
                const isSelected = province === prov.code;
                
                return (
                  <button
                    key={prov.code}
                    onClick={() => handleProvinceSelect(prov.code)}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all text-left",
                      "hover:scale-[1.02] active:scale-[0.98]",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:border-primary/30"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className={cn(
                        "w-4 h-4 flex-shrink-0",
                        isSelected ? "" : "text-primary"
                      )} />
                      <div>
                        <div className={cn(
                          "font-medium text-sm",
                          isSelected ? "" : "text-foreground"
                        )}>
                          {prov.code}
                        </div>
                        <div className={cn(
                          "text-xs truncate",
                          isSelected ? "opacity-90" : "text-muted-foreground"
                        )}>
                          {prov.name}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* City Input */}
      {province && (
        <div className="bg-card rounded-xl border border-border p-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            City (optional)
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={`Enter your city in ${PROVINCES.find((p) => p.code === province)?.name || province}`}
              value={cityInput}
              onChange={(e) => handleCityChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Adding your city helps us find local opportunities and grants
          </p>
        </div>
      )}

      {/* Selected Display */}
      {province && (
        <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="font-medium text-foreground">
              {PROVINCES.find((p) => p.code === province)?.name}
              {cityInput && `, ${cityInput}`}
            </div>
            <div className="text-sm text-muted-foreground">
              Your business ideas will be tailored to this location
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepLocation;