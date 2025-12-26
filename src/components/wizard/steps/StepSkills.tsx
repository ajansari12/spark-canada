import { SKILLS, SkillRating } from "@/types/wizard";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface StepSkillsProps {
  skills: SkillRating[];
  onChange: (skills: SkillRating[]) => void;
}

const StepSkills = ({ skills, onChange }: StepSkillsProps) => {
  const getSkillLevel = (skill: string): number => {
    const found = skills.find((s) => s.skill === skill);
    return found?.level || 0;
  };

  const setSkillLevel = (skill: string, level: 1 | 2 | 3 | 4 | 5) => {
    const existing = skills.find((s) => s.skill === skill);
    
    if (existing) {
      // If clicking the same level, remove the skill
      if (existing.level === level) {
        onChange(skills.filter((s) => s.skill !== skill));
      } else {
        // Update level
        onChange(skills.map((s) => (s.skill === skill ? { ...s, level } : s)));
      }
    } else {
      // Add new skill
      onChange([...skills, { skill, level }]);
    }
  };

  const ratedSkillsCount = skills.filter((s) => s.level > 0).length;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Rate your skills
        </h2>
        <p className="text-muted-foreground">
          Rate at least 3 skills to help us match you with the right business ideas
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm">
          <span className="font-medium text-foreground">{ratedSkillsCount}</span>
          <span className="text-muted-foreground">skills rated (min 3)</span>
        </div>
      </div>

      {/* Skills List */}
      <div className="space-y-3">
        {SKILLS.map((skill) => {
          const level = getSkillLevel(skill);
          
          return (
            <div
              key={skill}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl border transition-all",
                level > 0
                  ? "bg-primary/5 border-primary/20"
                  : "bg-card border-border hover:border-primary/30"
              )}
            >
              <span className="font-medium text-foreground">{skill}</span>
              
              {/* Star Rating */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setSkillLevel(skill, star as 1 | 2 | 3 | 4 | 5)}
                    className="p-1 hover:scale-110 transition-transform"
                    aria-label={`Rate ${skill} ${star} stars`}
                  >
                    <Star
                      className={cn(
                        "w-6 h-6 transition-colors",
                        star <= level
                          ? "fill-warning text-warning"
                          : "text-muted-foreground/30 hover:text-warning/50"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-muted-foreground/30" />
          <span>Beginner</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-warning text-warning" />
          <Star className="w-4 h-4 fill-warning text-warning" />
          <Star className="w-4 h-4 fill-warning text-warning" />
          <span>Intermediate</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-warning text-warning" />
          <Star className="w-4 h-4 fill-warning text-warning" />
          <Star className="w-4 h-4 fill-warning text-warning" />
          <Star className="w-4 h-4 fill-warning text-warning" />
          <Star className="w-4 h-4 fill-warning text-warning" />
          <span>Expert</span>
        </div>
      </div>
    </div>
  );
};

export default StepSkills;