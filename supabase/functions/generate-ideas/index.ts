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

    const systemPrompt = `You are an expert Canadian business advisor and startup consultant. Your job is to generate personalized, actionable business ideas for aspiring entrepreneurs in Canada.

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
      "quick_wins": ["First actionable step", "Second step", "Third step"],
      "competitors": ["Competitor 1", "Competitor 2"],
      "grants": ["Relevant Canadian grant or funding program"]
    }
  ]
}

Guidelines:
- Generate exactly 4 unique business ideas
- All costs in CAD
- Viability scores from 0-100 based on market potential, competition, and barriers to entry
- Market fit scores based on the specific Canadian province
- Skills match scores based on how well the user's skills align
- Quick wins should be specific, actionable first steps the user can take within 30 days
- Include real Canadian grants and funding programs when applicable
- Consider provincial regulations and market conditions
- Ideas should be realistic given the user's budget, time, and experience level`;

    const userPrompt = `Generate 4 personalized business ideas for a Canadian entrepreneur with the following profile:

**Location:** ${province}${city ? `, ${city}` : ''}
**Industries of Interest:** ${industries}
**Skills:** ${skills}
**Available Budget:** ${budgetRange} CAD
**Time Commitment:** ${timeCommitment} (${hoursPerWeek} hours/week)
**Risk Tolerance:** ${riskTolerance}
**Experience Level:** ${experienceLevel}
**Launch Timeline:** ${timeline}

Provide diverse ideas that match their skills, budget, and risk tolerance. Focus on opportunities specific to their Canadian province. Return valid JSON only.`;

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