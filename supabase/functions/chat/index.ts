import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, ideaContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build system prompt with idea context
    let systemPrompt = `You are SPARK Business Buddy, a friendly and knowledgeable AI assistant specializing in helping Canadian entrepreneurs start and grow small businesses. 

Your personality:
- Warm, encouraging, and approachable
- Practical and action-oriented
- Knowledgeable about Canadian business regulations, grants, and market conditions
- Focused on helping users succeed with their business ideas

Guidelines:
- Keep responses concise but helpful (2-3 paragraphs max)
- Provide specific, actionable advice
- Reference Canadian-specific resources when relevant (CRA, provincial programs, etc.)
- Be encouraging but realistic about challenges
- Use simple language, avoid jargon`;

    if (ideaContext) {
      systemPrompt += `

The user is asking about this specific business idea:
- Name: ${ideaContext.name}
- Description: ${ideaContext.description}
- Industry: ${ideaContext.industry || "General"}
- Province: ${ideaContext.province || "Not specified"}
- Startup Cost: $${ideaContext.startup_cost_min || 0} - $${ideaContext.startup_cost_max || 0}
- Monthly Revenue Potential: $${ideaContext.monthly_revenue_min || 0} - $${ideaContext.monthly_revenue_max || 0}
- Viability Score: ${ideaContext.viability_score || "N/A"}/100
- Market Fit Score: ${ideaContext.market_fit_score || "N/A"}/100
- Skills Match Score: ${ideaContext.skills_match_score || "N/A"}/100

Tailor your responses to this specific business idea and the user's situation.`;
    }

    console.log("Calling Lovable AI Gateway with streaming...");

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
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Stream the response back to the client
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
