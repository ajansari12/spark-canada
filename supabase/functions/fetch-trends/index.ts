import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[FETCH-TRENDS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    const { province } = await req.json();
    const provinceName = province === 'all' ? 'Canada' : province;
    
    logStep("Fetching trends for", { province: provinceName });

    const perplexityKey = Deno.env.get("PERPLEXITY_API_KEY");
    if (!perplexityKey) {
      throw new Error("PERPLEXITY_API_KEY not configured");
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });

    const prompt = `Analyze current business and industry trends in ${provinceName} for ${currentMonth} ${currentYear}. Provide data in the following JSON structure:

{
  "industryGrowth": [
    {"industry": "Industry Name", "growth": 15, "score": 85}
  ],
  "trendingOpportunities": [
    {"title": "Opportunity Name", "description": "Brief description", "trend": "up", "growth": "+25%", "category": "Category"}
  ],
  "marketInsights": [
    {"label": "35%", "value": "of businesses", "description": "are online-first"}
  ],
  "seasonalOpportunities": [
    {"season": "Winter (Dec-Feb)", "opportunities": ["Business type 1", "Business type 2"]}
  ],
  "businessTypeDistribution": [
    {"name": "Online Business", "value": 35}
  ]
}

Focus on:
1. Top 8 growing industries with realistic YoY growth percentages (can be negative)
2. 5 specific trending business opportunities with growth rates
3. 3 key market statistics for Canadian small businesses
4. Seasonal opportunities for all 4 seasons
5. Distribution of business types (online, hybrid, brick & mortar, service-based)

Use real Canadian market data and current economic conditions. Be specific to ${provinceName} if applicable.`;

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${perplexityKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content: "You are a Canadian business market analyst. Respond ONLY with valid JSON, no markdown formatting."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logStep("Perplexity API error", { status: response.status, error: errorText });
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const result = await response.json();
    const content = result.choices[0]?.message?.content;
    
    logStep("Raw response received", { length: content?.length });

    // Parse the JSON response
    let trendsData;
    try {
      // Remove any markdown code blocks if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      trendsData = JSON.parse(cleanContent);
    } catch (parseError) {
      logStep("JSON parse error, using fallback", { error: parseError });
      // Return fallback data if parsing fails
      trendsData = getFallbackData(provinceName);
    }

    // Add metadata
    trendsData.generatedAt = new Date().toISOString();
    trendsData.province = provinceName;

    // Add colors to business type distribution
    const colors = [
      "hsl(var(--primary))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
    ];
    
    if (trendsData.businessTypeDistribution) {
      trendsData.businessTypeDistribution = trendsData.businessTypeDistribution.map(
        (item: { name: string; value: number }, index: number) => ({
          ...item,
          color: colors[index % colors.length],
        })
      );
    }

    logStep("Returning trends data", { 
      industries: trendsData.industryGrowth?.length,
      opportunities: trendsData.trendingOpportunities?.length 
    });

    return new Response(JSON.stringify({ trends: trendsData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

function getFallbackData(province: string) {
  return {
    industryGrowth: [
      { industry: "Tech & AI", growth: 24, score: 92 },
      { industry: "E-commerce", growth: 18, score: 88 },
      { industry: "Healthcare", growth: 15, score: 85 },
      { industry: "Clean Energy", growth: 22, score: 90 },
      { industry: "Food & Bev", growth: 8, score: 75 },
      { industry: "Real Estate", growth: -3, score: 62 },
      { industry: "Retail", growth: 5, score: 68 },
      { industry: "Manufacturing", growth: 7, score: 72 },
    ],
    trendingOpportunities: [
      {
        title: "AI-Powered Services",
        description: "Businesses integrating AI tools for customer service, content creation, and automation are seeing rapid growth.",
        trend: "up",
        growth: "+45%",
        category: "Technology",
      },
      {
        title: "Sustainable Products",
        description: "Eco-friendly and sustainable product lines are outperforming traditional alternatives.",
        trend: "up",
        growth: "+28%",
        category: "Retail",
      },
      {
        title: "Remote Work Solutions",
        description: "Tools and services supporting remote/hybrid work continue to show strong demand.",
        trend: "up",
        growth: "+22%",
        category: "Services",
      },
      {
        title: "Local Food Production",
        description: "Farm-to-table and local food production businesses are gaining market share.",
        trend: "up",
        growth: "+18%",
        category: "Food & Beverage",
      },
      {
        title: "Traditional Retail",
        description: "Pure brick-and-mortar retail without online presence continues to face challenges.",
        trend: "down",
        growth: "-12%",
        category: "Retail",
      },
    ],
    marketInsights: [
      { label: "35%", value: "of new businesses", description: "are purely online" },
      { label: "$15K", value: "average startup cost", description: `in ${province}` },
      { label: "78%", value: "of successful startups", description: "use digital marketing" },
    ],
    seasonalOpportunities: [
      { season: "Winter (Dec-Feb)", opportunities: ["Holiday retail", "Tax preparation services", "Indoor fitness", "Home renovation planning"] },
      { season: "Spring (Mar-May)", opportunities: ["Landscaping & gardening", "Moving services", "Wedding industry", "Outdoor equipment"] },
      { season: "Summer (Jun-Aug)", opportunities: ["Tourism & hospitality", "Outdoor recreation", "Food trucks & festivals", "Summer camps"] },
      { season: "Fall (Sep-Nov)", opportunities: ["Back-to-school retail", "Home heating services", "Halloween & Thanksgiving", "Year-end consulting"] },
    ],
    businessTypeDistribution: [
      { name: "Online Business", value: 35 },
      { name: "Hybrid", value: 30 },
      { name: "Brick & Mortar", value: 20 },
      { name: "Service-based", value: 15 },
    ],
  };
}
