import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { wizardData, sessionId } = await req.json();
    console.log("Generating ideas for session:", sessionId);
    console.log("Wizard data:", JSON.stringify(wizardData));

    // Build the prompt from wizard data
    const industries = wizardData.industries?.join(', ') || 'general';
    const skills = wizardData.skills?.map((s: { skill: string; level: number }) =>
      `${s.skill} (${s.level}/5)`
    ).join(', ') || 'general business skills';
    const budgetRange = `$${(wizardData.budgetMin / 1000).toFixed(0)}K - $${(wizardData.budgetMax / 1000).toFixed(0)}K`;
    const timeCommitment = wizardData.timeCommitment || 'flexible';
    const hoursPerWeek = wizardData.hoursPerWeek || 20;
    const province = wizardData.province || 'Ontario';
    const city = wizardData.city || '';
    const riskTolerance = wizardData.riskTolerance || 'medium';
    const experienceLevel = wizardData.experienceLevel || 'beginner';
    const timeline = wizardData.timeline || '3-6-months';

    // 2026 Enhanced preferences
    const isSideHustle = wizardData.isSideHustle || false;
    const prioritizeRecessionResistance = wizardData.prioritizeRecessionResistance || false;
    const isNewcomer = wizardData.isNewcomer || false;

    const systemPrompt = `You are an expert Canadian business advisor and startup consultant specializing in 2026 economic conditions. Your job is to generate personalized, actionable business ideas for aspiring entrepreneurs in Canada.

IMPORTANT CONTEXT FOR 2026:
- Economic uncertainty with higher interest rates and inflation concerns
- AI tools are transforming how businesses operate - consider how AI can reduce costs
- Remote work has become permanent - consider location-independent opportunities
- Canada is welcoming 500K+ immigrants annually - consider credential-free opportunities
- Growing demand for recession-resistant, essential services

You must return a JSON object with exactly this structure:
{
  "ideas": [
    {
      "name": "Business Name",
      "description": "2-3 sentence description of the business concept",
      "industry": "Primary industry category",
      "startup_cost_min": 10000,
      "startup_cost_max": 25000,
      "monthly_revenue_min": 3000,
      "monthly_revenue_max": 8000,
      "viability_score": 85,
      "market_fit_score": 80,
      "skills_match_score": 90,
      "recession_resistance_score": 75,
      "pain_point_severity": 7,
      "ai_leverage_score": 60,
      "side_hustle_compatible": true,
      "newcomer_friendly": true,
      "quick_wins": ["First actionable step", "Second step", "Third step"],
      "action_plan": {
        "day30": [
          {"task": "Register business with CRA", "category": "legal", "resources": ["canada.ca/business-registration"], "completed": false},
          {"task": "Set up business bank account", "category": "setup", "resources": ["RBC", "TD", "Scotiabank small business accounts"], "completed": false}
        ],
        "day60": [
          {"task": "Launch basic website or social media presence", "category": "marketing", "resources": ["Shopify", "Wix", "Instagram Business"], "completed": false}
        ],
        "day90": [
          {"task": "Acquire first 5 paying customers", "category": "operations", "resources": ["Local networking events", "Facebook groups"], "completed": false}
        ]
      },
      "competitors": ["Competitor 1 - brief description", "Competitor 2 - brief description"],
      "grants": ["Relevant Canadian grant or funding program with eligibility notes"]
    }
  ]
}

SCORING GUIDELINES:
- viability_score (0-100): Market potential, competition level, barriers to entry
- market_fit_score (0-100): How well this fits the specific Canadian province
- skills_match_score (0-100): How well the user's skills align
- recession_resistance_score (0-100): How well this business survives economic downturns
  - 80+: Essential services (healthcare, food, utilities)
  - 60-79: Stable B2B services, subscription models
  - 40-59: Discretionary but affordable
  - <40: Luxury, highly cyclical
- pain_point_severity (1-10): How urgent is the problem this solves
  - 9-10: "Hair on fire" - desperate need, high willingness to pay
  - 7-8: Significant pain, actively seeking solutions
  - 4-6: Moderate frustration
  - 1-3: Nice to have
- ai_leverage_score (0-100): How much AI tools can reduce costs/increase efficiency
- side_hustle_compatible: Can be run with 10-20 hours/week while keeping a day job
- newcomer_friendly: Does NOT require Canadian credentials, certifications, or local network

ADDITIONAL GUIDELINES:
- Generate exactly 4 unique business ideas
- All costs in CAD
- Action plans must include REAL Canadian resources (CRA, provincial websites, actual banks)
- Include real Canadian grants: Futurpreneur (ages 18-39), BDC, IRAP, provincial programs
- Consider provincial regulations: Quebec (language), Ontario (HST), BC (environmental)
- Ideas should be realistic given the user's budget, time, and experience level`;

    // Build mode-specific instructions
    let modeInstructions = '';
    if (isSideHustle) {
      modeInstructions += `\n**SIDE HUSTLE MODE ACTIVE**: All ideas MUST be compatible with 10-20 hours/week and keeping a full-time job. Prioritize evening/weekend operation, low overhead, and scalable models.`;
    }
    if (prioritizeRecessionResistance) {
      modeInstructions += `\n**RECESSION-PROOF MODE ACTIVE**: Prioritize ideas with recession_resistance_score of 70+. Focus on essential services, B2B stability, and subscription models.`;
    }
    if (isNewcomer) {
      modeInstructions += `\n**NEWCOMER MODE ACTIVE**: All ideas MUST be newcomer_friendly (no Canadian credentials required). Include settlement agency resources and newcomer-specific grants like Futurpreneur.`;
    }

    const userPrompt = `Generate 4 personalized business ideas for a Canadian entrepreneur with the following profile:

**Location:** ${province}${city ? `, ${city}` : ''}
**Industries of Interest:** ${industries}
**Skills:** ${skills}
**Available Budget:** ${budgetRange} CAD
**Time Commitment:** ${timeCommitment} (${hoursPerWeek} hours/week)
**Risk Tolerance:** ${riskTolerance}
**Experience Level:** ${experienceLevel}
**Launch Timeline:** ${timeline}
${modeInstructions}

Provide diverse ideas that match their skills, budget, and risk tolerance. Focus on opportunities specific to their Canadian province. Include detailed 30-60-90 day action plans with real Canadian resources. Return valid JSON only.`;

    console.log("Calling Lovable AI gateway...");

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
    console.log("AI response received");

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON from the response
    let ideas;
    try {
      // Try to extract JSON from the response (handle markdown code blocks)
      let jsonStr = content;
      if (content.includes('```json')) {
        jsonStr = content.split('```json')[1].split('```')[0].trim();
      } else if (content.includes('```')) {
        jsonStr = content.split('```')[1].split('```')[0].trim();
      }
      
      const parsed = JSON.parse(jsonStr);
      ideas = parsed.ideas || parsed;
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.error("Raw content:", content);
      throw new Error("Failed to parse business ideas from AI response");
    }

    console.log(`Successfully generated ${ideas.length} ideas`);

    return new Response(JSON.stringify({ 
      ideas,
      sessionId 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-ideas function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});