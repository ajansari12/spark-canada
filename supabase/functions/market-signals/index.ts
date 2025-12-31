import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MarketSignalRequest {
  ideaName: string;
  industry: string;
  province: string;
  competitors?: string[];
}

interface MarketSignals {
  trends: string[];
  marketConditions: {
    sentiment: 'positive' | 'neutral' | 'negative';
    factors: string[];
  };
  competitiveLandscape: {
    saturation: 'low' | 'medium' | 'high';
    opportunities: string[];
  };
  seasonality?: {
    bestMonths: string[];
    slowMonths: string[];
  };
  timingScore: number;
  timingReason: string;
  citations?: string[];
  generatedAt: string;
  provider: 'perplexity' | 'claude' | 'lovable';
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ideaName, industry, province, competitors } = await req.json() as MarketSignalRequest;

    if (!ideaName || !industry) {
      return new Response(
        JSON.stringify({ error: "ideaName and industry are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Try Perplexity first (best for real-time data)
    const PERPLEXITY_API_KEY = Deno.env.get("PERPLEXITY_API_KEY");

    if (PERPLEXITY_API_KEY) {
      try {
        const perplexityResponse = await fetch("https://api.perplexity.ai/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.1-sonar-large-128k-online",
            messages: [
              {
                role: "system",
                content: `You are a Canadian market research analyst providing real-time market intelligence. Focus on:
1. Current market trends in Canadian provinces
2. Recent news about specific industries in Canada
3. Competitor activity and market dynamics
4. Economic indicators relevant to small businesses
5. Regulatory changes or government programs

Respond with factual, current data. Always cite sources when possible.`
              },
              {
                role: "user",
                content: `Analyze current market signals for this Canadian business idea:

Business: ${ideaName}
Industry: ${industry}
Province: ${province}
${competitors?.length ? `Known Competitors: ${competitors.join(', ')}` : ''}

Provide a JSON response with this structure:
{
  "trends": ["trend 1", "trend 2", "trend 3"],
  "marketConditions": {
    "sentiment": "positive" | "neutral" | "negative",
    "factors": ["factor 1", "factor 2"]
  },
  "competitiveLandscape": {
    "saturation": "low" | "medium" | "high",
    "opportunities": ["opportunity 1", "opportunity 2"]
  },
  "seasonality": {
    "bestMonths": ["January", "February"],
    "slowMonths": ["July", "August"]
  },
  "timingScore": 1-10,
  "timingReason": "explanation"
}`
              }
            ],
            temperature: 0.2,
            max_tokens: 2000,
          }),
        });

        if (perplexityResponse.ok) {
          const perplexityData = await perplexityResponse.json();
          const content = perplexityData.choices[0].message.content;

          // Try to parse as JSON
          let parsedSignals: Partial<MarketSignals>;
          try {
            // Extract JSON from the response (it might be wrapped in markdown)
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              parsedSignals = JSON.parse(jsonMatch[0]);
            } else {
              throw new Error("No JSON found in response");
            }
          } catch {
            // If parsing fails, create structured response from text
            parsedSignals = {
              trends: extractBulletPoints(content, "trend"),
              marketConditions: {
                sentiment: detectSentiment(content),
                factors: extractBulletPoints(content, "factor|condition|economic"),
              },
              competitiveLandscape: {
                saturation: detectSaturation(content),
                opportunities: extractBulletPoints(content, "opportunit|gap|potential"),
              },
              timingScore: detectTimingScore(content),
              timingReason: extractTimingReason(content),
            };
          }

          const signals: MarketSignals = {
            trends: parsedSignals.trends || [],
            marketConditions: parsedSignals.marketConditions || { sentiment: 'neutral', factors: [] },
            competitiveLandscape: parsedSignals.competitiveLandscape || { saturation: 'medium', opportunities: [] },
            seasonality: parsedSignals.seasonality,
            timingScore: parsedSignals.timingScore || 5,
            timingReason: parsedSignals.timingReason || "Market conditions are stable for this type of business.",
            citations: perplexityData.citations || [],
            generatedAt: new Date().toISOString(),
            provider: 'perplexity',
          };

          return new Response(
            JSON.stringify({ success: true, signals }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } catch (error) {
        console.error("Perplexity error:", error);
        // Fall through to Claude
      }
    }

    // Fallback to Claude/Anthropic
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

    if (ANTHROPIC_API_KEY) {
      try {
        const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-3-haiku-20240307",
            max_tokens: 2000,
            messages: [
              {
                role: "user",
                content: `As a Canadian business analyst, analyze market signals for:

Business Idea: ${ideaName}
Industry: ${industry}
Province: ${province}
${competitors?.length ? `Competitors: ${competitors.join(', ')}` : ''}

Provide analysis as JSON:
{
  "trends": ["3-5 current industry trends in Canada"],
  "marketConditions": {
    "sentiment": "positive/neutral/negative",
    "factors": ["key economic factors"]
  },
  "competitiveLandscape": {
    "saturation": "low/medium/high",
    "opportunities": ["market gaps and opportunities"]
  },
  "seasonality": {
    "bestMonths": ["best months for this business"],
    "slowMonths": ["slower months"]
  },
  "timingScore": 1-10,
  "timingReason": "explanation of why now is good/bad timing"
}

Base your analysis on general knowledge of Canadian markets as of early 2025.`
              }
            ],
          }),
        });

        if (claudeResponse.ok) {
          const claudeData = await claudeResponse.json();
          const content = claudeData.content[0].text;

          let parsedSignals: Partial<MarketSignals>;
          try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              parsedSignals = JSON.parse(jsonMatch[0]);
            } else {
              throw new Error("No JSON found");
            }
          } catch {
            parsedSignals = {
              trends: ["Digital transformation accelerating", "Sustainability focus increasing", "Remote work opportunities growing"],
              marketConditions: { sentiment: 'neutral', factors: ["Economic uncertainty", "Interest rate stabilization"] },
              competitiveLandscape: { saturation: 'medium', opportunities: ["Niche market focus", "Local service emphasis"] },
              timingScore: 6,
              timingReason: "Market conditions are stable with moderate growth potential.",
            };
          }

          const signals: MarketSignals = {
            trends: parsedSignals.trends || [],
            marketConditions: parsedSignals.marketConditions || { sentiment: 'neutral', factors: [] },
            competitiveLandscape: parsedSignals.competitiveLandscape || { saturation: 'medium', opportunities: [] },
            seasonality: parsedSignals.seasonality,
            timingScore: parsedSignals.timingScore || 5,
            timingReason: parsedSignals.timingReason || "Based on current market analysis.",
            generatedAt: new Date().toISOString(),
            provider: 'claude',
          };

          return new Response(
            JSON.stringify({ success: true, signals }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } catch (error) {
        console.error("Claude error:", error);
      }
    }

    // Final fallback: Use Lovable AI Gateway (same as other functions)
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY") || Deno.env.get("OPENAI_API_KEY");

    if (LOVABLE_API_KEY) {
      const lovableResponse = await fetch("https://api.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a Canadian market analyst. Provide market signals analysis as JSON."
            },
            {
              role: "user",
              content: `Analyze market signals for "${ideaName}" in ${industry} industry, ${province} province. Respond with JSON containing trends, marketConditions (sentiment, factors), competitiveLandscape (saturation, opportunities), timingScore (1-10), and timingReason.`
            }
          ],
          temperature: 0.3,
        }),
      });

      if (lovableResponse.ok) {
        const data = await lovableResponse.json();
        const content = data.choices[0].message.content;

        let parsedSignals: Partial<MarketSignals>;
        try {
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          parsedSignals = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
        } catch {
          parsedSignals = {};
        }

        const signals: MarketSignals = {
          trends: parsedSignals.trends || ["Market is evolving", "Digital adoption growing", "Consumer preferences shifting"],
          marketConditions: parsedSignals.marketConditions || { sentiment: 'neutral', factors: ["Stable economy", "Growing demand"] },
          competitiveLandscape: parsedSignals.competitiveLandscape || { saturation: 'medium', opportunities: ["Market gaps exist"] },
          timingScore: parsedSignals.timingScore || 6,
          timingReason: parsedSignals.timingReason || "Moderate opportunity with careful execution.",
          generatedAt: new Date().toISOString(),
          provider: 'lovable',
        };

        return new Response(
          JSON.stringify({ success: true, signals }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    throw new Error("No AI provider available. Please configure PERPLEXITY_API_KEY, ANTHROPIC_API_KEY, or LOVABLE_API_KEY.");

  } catch (error) {
    console.error("Market signals error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to generate market signals" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Helper functions for parsing unstructured responses

function extractBulletPoints(text: string, pattern: string): string[] {
  const regex = new RegExp(`[•\\-\\d\\.]+\\s*([^•\\-\\n]+${pattern}[^•\\-\\n]*)`, 'gi');
  const matches = text.match(regex) || [];
  return matches.slice(0, 5).map(m => m.replace(/^[•\-\d\.]+\s*/, '').trim());
}

function detectSentiment(text: string): 'positive' | 'neutral' | 'negative' {
  const positiveWords = /\b(growing|increasing|strong|positive|opportunity|favorable|boom|rise)\b/gi;
  const negativeWords = /\b(declining|decreasing|weak|negative|challenging|difficult|downturn|fall)\b/gi;

  const positiveCount = (text.match(positiveWords) || []).length;
  const negativeCount = (text.match(negativeWords) || []).length;

  if (positiveCount > negativeCount + 2) return 'positive';
  if (negativeCount > positiveCount + 2) return 'negative';
  return 'neutral';
}

function detectSaturation(text: string): 'low' | 'medium' | 'high' {
  const highWords = /\b(saturated|crowded|competitive|many competitors|established players)\b/gi;
  const lowWords = /\b(emerging|untapped|few competitors|niche|gap in market)\b/gi;

  const highCount = (text.match(highWords) || []).length;
  const lowCount = (text.match(lowWords) || []).length;

  if (highCount > lowCount) return 'high';
  if (lowCount > highCount) return 'low';
  return 'medium';
}

function detectTimingScore(text: string): number {
  const veryPositive = /\b(excellent|perfect|ideal|best)\s*tim/gi;
  const positive = /\b(good|favorable|right)\s*tim/gi;
  const negative = /\b(bad|poor|challenging)\s*tim/gi;

  if (veryPositive.test(text)) return 9;
  if (positive.test(text)) return 7;
  if (negative.test(text)) return 4;
  return 6;
}

function extractTimingReason(text: string): string {
  const sentences = text.split(/[.!?]+/);
  const timingSentence = sentences.find(s =>
    /tim(e|ing)|now|current|market|opportunit/i.test(s)
  );
  return timingSentence?.trim().slice(0, 200) || "Market conditions suggest moderate opportunity.";
}
