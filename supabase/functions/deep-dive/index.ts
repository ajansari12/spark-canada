import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DeepDiveReport {
  ideaId: string;
  ideaName: string;
  generatedAt: string;

  // Overall Scores
  overallScore: number;
  marketSizeScore: number;
  competitionScore: number;
  communityDemandScore: number;
  regulatoryEaseScore: number;
  fundingAvailabilityScore: number;

  // Pain Point Analysis
  painPointSeverity: number;
  painPointDescription: string;
  painPointSources: string[];

  // Market Analysis
  canadianTAM: string;
  provincialOpportunities: Record<string, string>;
  growthTrend: 'rising' | 'stable' | 'declining';
  marketInsights: string[];

  // Competition
  competitorCount: string;
  topCompetitors: Array<{
    name: string;
    description: string;
    weakness: string;
  }>;
  marketGaps: string[];
  differentiationStrategies: string[];

  // Community Signals
  communityInsights: string[];
  targetAudience: string[];
  customerAcquisitionChannels: string[];

  // Regulatory & Compliance
  federalRequirements: string[];
  provincialRequirements: string[];
  licensesNeeded: string[];
  complianceComplexity: 'low' | 'medium' | 'high';

  // Funding Opportunities
  matchedGrants: Array<{
    name: string;
    amount: string;
    eligibility: string;
  }>;
  fundingStrategies: string[];

  // Execution Plan
  quickWins: string[];
  criticalMilestones: Array<{
    timeline: string;
    milestone: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  potentialChallenges: string[];
  successFactors: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { idea, userProfile } = await req.json();
    console.log("Generating Deep Dive for idea:", idea.name);

    const systemPrompt = `You are SPARK Deep Dive, an expert Canadian business research analyst. Your job is to provide comprehensive market validation and business planning insights for entrepreneurs in Canada.

You must return a JSON object with this EXACT structure (no markdown, just valid JSON):
{
  "overallScore": 75,
  "marketSizeScore": 80,
  "competitionScore": 70,
  "communityDemandScore": 75,
  "regulatoryEaseScore": 65,
  "fundingAvailabilityScore": 70,

  "painPointSeverity": 7,
  "painPointDescription": "Description of the core problem being solved",
  "painPointSources": ["Where customers express this pain - e.g., Reddit, forums, reviews"],

  "canadianTAM": "$X billion Canadian market",
  "provincialOpportunities": {
    "ON": "Ontario opportunity description",
    "BC": "BC opportunity description",
    "AB": "Alberta opportunity description"
  },
  "growthTrend": "rising",
  "marketInsights": ["Insight 1", "Insight 2", "Insight 3"],

  "competitorCount": "Estimated number in Canada",
  "topCompetitors": [
    {"name": "Competitor 1", "description": "What they do", "weakness": "Their weakness you can exploit"}
  ],
  "marketGaps": ["Gap 1", "Gap 2"],
  "differentiationStrategies": ["Strategy 1", "Strategy 2"],

  "communityInsights": ["Where target customers gather online/offline"],
  "targetAudience": ["Specific customer segments"],
  "customerAcquisitionChannels": ["Best channels to reach customers"],

  "federalRequirements": ["CRA registration", "GST/HST if applicable"],
  "provincialRequirements": ["Province-specific requirements"],
  "licensesNeeded": ["Required licenses/permits"],
  "complianceComplexity": "low",

  "matchedGrants": [
    {"name": "Grant name", "amount": "$X - $Y", "eligibility": "Who qualifies"}
  ],
  "fundingStrategies": ["Bootstrapping tips", "Funding approaches"],

  "quickWins": ["First 3 actions to take"],
  "criticalMilestones": [
    {"timeline": "Week 1-2", "milestone": "What to accomplish", "priority": "high"}
  ],
  "potentialChallenges": ["Challenge 1", "Challenge 2"],
  "successFactors": ["Key success factor 1", "Key success factor 2"]
}

SCORING GUIDELINES (0-100):
- overallScore: Weighted average of all factors
- marketSizeScore: 80+ = Large addressable market, 60-79 = Medium, <60 = Niche
- competitionScore: 80+ = Low competition/high opportunity, 60-79 = Moderate, <60 = Crowded
- communityDemandScore: Based on online discussions, search trends, social proof
- regulatoryEaseScore: 80+ = Easy compliance, 60-79 = Moderate, <60 = Complex regulations
- fundingAvailabilityScore: Based on matching grants and funding accessibility

PAIN POINT SEVERITY (1-10):
- 9-10: "Hair on fire" - Desperate need, people actively searching for solutions
- 7-8: Significant pain, high willingness to pay
- 5-6: Moderate frustration, nice to solve
- 1-4: Nice to have, low urgency

IMPORTANT:
- Focus on CANADIAN market conditions, regulations, and opportunities
- Reference real Canadian grants (Futurpreneur, BDC, IRAP, provincial programs)
- Consider provincial differences (Quebec language, BC environmental, Alberta energy)
- Provide actionable, specific insights - not generic advice
- All monetary values in CAD`;

    const userPrompt = `Generate a comprehensive Deep Dive research report for this Canadian business idea:

**Business Idea:**
- Name: ${idea.name}
- Description: ${idea.description}
- Industry: ${idea.industry || 'General'}
- Province: ${idea.province || 'Ontario'}
- Startup Cost: $${idea.startup_cost_min || 0} - $${idea.startup_cost_max || 0} CAD
- Monthly Revenue Potential: $${idea.monthly_revenue_min || 0} - $${idea.monthly_revenue_max || 0} CAD
- Viability Score: ${idea.viability_score || 'N/A'}/100
- Recession Resistance: ${idea.recession_resistance_score || 'N/A'}/100
- Side Hustle Compatible: ${idea.side_hustle_compatible ? 'Yes' : 'No'}
- Newcomer Friendly: ${idea.newcomer_friendly ? 'Yes' : 'No'}

${userProfile ? `**User Profile:**
- Is Newcomer: ${userProfile.isNewcomer ? 'Yes' : 'No'}
- Is Side Hustle: ${userProfile.isSideHustle ? 'Yes' : 'No'}
- Experience Level: ${userProfile.experienceLevel || 'Beginner'}` : ''}

Provide a thorough Canadian market analysis with real insights. Return valid JSON only.`;

    console.log("Calling Lovable AI for Deep Dive...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({
          error: "Rate limit exceeded. Please wait a moment and try again."
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (response.status === 402) {
        return new Response(JSON.stringify({
          error: "AI credits exhausted. Please add credits to continue."
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received for Deep Dive");

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON from the response
    let report: Partial<DeepDiveReport>;
    try {
      let jsonStr = content;
      if (content.includes('```json')) {
        jsonStr = content.split('```json')[1].split('```')[0].trim();
      } else if (content.includes('```')) {
        jsonStr = content.split('```')[1].split('```')[0].trim();
      }

      report = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse Deep Dive response:", parseError);
      console.error("Raw content:", content);
      throw new Error("Failed to parse research report from AI response");
    }

    // Add metadata
    const fullReport: DeepDiveReport = {
      ideaId: idea.id,
      ideaName: idea.name,
      generatedAt: new Date().toISOString(),
      ...report as Omit<DeepDiveReport, 'ideaId' | 'ideaName' | 'generatedAt'>,
    };

    console.log("Deep Dive report generated successfully");

    return new Response(JSON.stringify({
      report: fullReport,
      success: true,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in deep-dive function:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
