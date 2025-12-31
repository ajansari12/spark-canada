// Wizard types for the business idea generator

export interface WizardData {
  // Step 1: Mode Selection
  isSideHustle: boolean;

  // Step 2: Industries
  industries: string[];

  // Step 3: Skills
  skills: SkillRating[];

  // Step 4: Budget
  budgetMin: number;
  budgetMax: number;

  // Step 5: Time Commitment
  timeCommitment: 'part-time' | 'full-time' | 'flexible';
  hoursPerWeek: number;

  // Step 6: Location
  province: string;
  city?: string;

  // Step 7: Risk Profile
  riskTolerance: 'low' | 'medium' | 'high';
  experienceLevel: 'beginner' | 'some-experience' | 'experienced';
  timeline: 'asap' | '3-6-months' | '6-12-months' | '1-year-plus';

  // Economic Preferences (2026 enhancements)
  prioritizeRecessionResistance: boolean;
  isNewcomer: boolean;

  // Newcomer-specific fields (only used if isNewcomer is true)
  yearsInCanada: string;
  hasCanadianExperience: boolean;
  languageLevel: string;
  credentialStatus: string;
}

export interface SkillRating {
  skill: string;
  level: 1 | 2 | 3 | 4 | 5;
}

export interface Industry {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: 'primary' | 'success' | 'accent' | 'warning';
}

export interface Province {
  code: string;
  name: string;
  region: 'west' | 'central' | 'atlantic' | 'north';
}

export const INDUSTRIES: Industry[] = [
  { id: 'food-beverage', name: 'Food & Beverage', icon: 'UtensilsCrossed', description: 'Restaurants, cafes, catering, food products', color: 'primary' },
  { id: 'technology', name: 'Technology', icon: 'Laptop', description: 'Software, apps, IT services, SaaS', color: 'accent' },
  { id: 'health-wellness', name: 'Health & Wellness', icon: 'Heart', description: 'Fitness, nutrition, mental health, spa', color: 'success' },
  { id: 'retail', name: 'Retail & E-commerce', icon: 'ShoppingBag', description: 'Online stores, boutiques, marketplaces', color: 'warning' },
  { id: 'creative', name: 'Creative Services', icon: 'Palette', description: 'Design, photography, video, art', color: 'primary' },
  { id: 'education', name: 'Education & Training', icon: 'GraduationCap', description: 'Tutoring, courses, coaching, workshops', color: 'accent' },
  { id: 'real-estate', name: 'Real Estate', icon: 'Building2', description: 'Property, development, management', color: 'success' },
  { id: 'professional-services', name: 'Professional Services', icon: 'Briefcase', description: 'Consulting, legal, accounting, marketing', color: 'warning' },
  { id: 'home-services', name: 'Home Services', icon: 'Home', description: 'Cleaning, landscaping, repairs, renovation', color: 'primary' },
  { id: 'pet-services', name: 'Pet Services', icon: 'Dog', description: 'Pet care, grooming, training, products', color: 'accent' },
  { id: 'tourism', name: 'Tourism & Hospitality', icon: 'MapPin', description: 'Travel, lodging, experiences, tours', color: 'success' },
  { id: 'sustainability', name: 'Sustainability', icon: 'Leaf', description: 'Green products, recycling, eco-services', color: 'warning' },
  { id: 'automotive', name: 'Automotive', icon: 'Car', description: 'Auto repair, detailing, sales, rental', color: 'primary' },
  { id: 'beauty', name: 'Beauty & Personal Care', icon: 'Sparkles', description: 'Salon, skincare, cosmetics, barbershop', color: 'accent' },
  { id: 'finance', name: 'Finance & Insurance', icon: 'DollarSign', description: 'Financial planning, bookkeeping, insurance', color: 'success' },
  { id: 'manufacturing', name: 'Manufacturing', icon: 'Factory', description: 'Production, crafts, artisan goods', color: 'warning' },
  // 2026 Growth Industries
  { id: 'ai-automation', name: 'AI & Automation', icon: 'Bot', description: 'AI consulting, automation services, chatbots', color: 'accent' },
  { id: 'remote-work', name: 'Remote Work Services', icon: 'Wifi', description: 'Virtual offices, co-working, remote tools', color: 'primary' },
  { id: 'mental-health', name: 'Mental Health Services', icon: 'Brain', description: 'Therapy, counseling, wellness coaching', color: 'success' },
  { id: 'content-creation', name: 'Content Creation', icon: 'Video', description: 'YouTube, podcasts, newsletters, UGC', color: 'warning' },
  { id: 'elder-care', name: 'Elder Care', icon: 'HeartHandshake', description: 'Senior care, home assistance, tech for seniors', color: 'primary' },
  { id: 'skilled-trades', name: 'Skilled Trades', icon: 'Wrench', description: 'Electrical, plumbing, HVAC, carpentry', color: 'accent' },
];

export const SKILLS = [
  'Sales & Marketing',
  'Customer Service',
  'Financial Management',
  'Project Management',
  'Technical/IT Skills',
  'Writing & Communication',
  'Design & Creativity',
  'Leadership',
  'Problem Solving',
  'Networking',
  'Social Media',
  'Public Speaking',
  'Data Analysis',
  'Negotiation',
  'Time Management',
];

export const PROVINCES: Province[] = [
  { code: 'BC', name: 'British Columbia', region: 'west' },
  { code: 'AB', name: 'Alberta', region: 'west' },
  { code: 'SK', name: 'Saskatchewan', region: 'west' },
  { code: 'MB', name: 'Manitoba', region: 'west' },
  { code: 'ON', name: 'Ontario', region: 'central' },
  { code: 'QC', name: 'Quebec', region: 'central' },
  { code: 'NB', name: 'New Brunswick', region: 'atlantic' },
  { code: 'NS', name: 'Nova Scotia', region: 'atlantic' },
  { code: 'PE', name: 'Prince Edward Island', region: 'atlantic' },
  { code: 'NL', name: 'Newfoundland and Labrador', region: 'atlantic' },
  { code: 'YT', name: 'Yukon', region: 'north' },
  { code: 'NT', name: 'Northwest Territories', region: 'north' },
  { code: 'NU', name: 'Nunavut', region: 'north' },
];

export const BUDGET_RANGES = [
  { min: 1000, max: 5000, label: '$1K - $5K', description: 'Micro startup' },
  { min: 5000, max: 15000, label: '$5K - $15K', description: 'Small startup' },
  { min: 15000, max: 30000, label: '$15K - $30K', description: 'Medium startup' },
  { min: 30000, max: 50000, label: '$30K - $50K', description: 'Established startup' },
  { min: 50000, max: 100000, label: '$50K - $100K', description: 'Growth business' },
  { min: 100000, max: 250000, label: '$100K+', description: 'Significant investment' },
];

export const TIME_COMMITMENTS = [
  { value: 'part-time' as const, label: 'Part-time', hours: '10-20 hrs/week', description: 'Keep your day job while building' },
  { value: 'full-time' as const, label: 'Full-time', hours: '40+ hrs/week', description: 'All-in on your business' },
  { value: 'flexible' as const, label: 'Flexible', hours: 'Varies', description: 'Adjust based on demand' },
];

export const defaultWizardData: WizardData = {
  isSideHustle: false,
  industries: [],
  skills: [],
  budgetMin: 5000,
  budgetMax: 30000,
  timeCommitment: 'part-time',
  hoursPerWeek: 15,
  province: '',
  city: '',
  riskTolerance: 'medium',
  experienceLevel: 'beginner',
  timeline: '3-6-months',
  prioritizeRecessionResistance: false,
  isNewcomer: false,
  // Newcomer-specific defaults
  yearsInCanada: '',
  hasCanadianExperience: false,
  languageLevel: '',
  credentialStatus: '',
};