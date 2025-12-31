import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AssetRequest {
  idea: {
    id: string;
    name: string;
    description: string;
    industry: string;
    province: string;
    startup_cost_min: number;
    startup_cost_max: number;
    monthly_revenue_min: number;
    monthly_revenue_max: number;
    competitors: string[];
    grants: string[];
    quick_wins: string[];
  };
  assetType: 'landing_page' | 'facebook_ad' | 'google_ad' | 'email_sequence' | 'brand_brief' | 'licensing_checklist';
}

const assetPrompts = {
  landing_page: (idea: AssetRequest['idea']) => `
You are an expert copywriter specializing in Canadian small business websites.

Generate a complete landing page copy for this Canadian business:

**Business:** ${idea.name}
**Description:** ${idea.description}
**Industry:** ${idea.industry}
**Province:** ${idea.province}
**Price Range:** $${idea.startup_cost_min} - $${idea.startup_cost_max} CAD

Create landing page copy with these sections:
1. **Hero Section**: Compelling headline (max 10 words), subheadline (max 25 words), CTA button text
2. **Problem Section**: 3 pain points the target customer experiences
3. **Solution Section**: How this business solves those problems
4. **Benefits Section**: 4 key benefits with icons suggestions
5. **How It Works**: 3-4 step process
6. **Testimonial Placeholder**: Template for future testimonials
7. **Pricing Section**: Suggested pricing tiers in CAD
8. **FAQ Section**: 5 common questions and answers
9. **Final CTA**: Closing statement and call-to-action

IMPORTANT Canadian considerations:
- All prices in CAD ($)
- Reference Canadian cities/provinces where relevant
- Mention Canadian-specific trust signals (BBB, local associations)
- Include bilingual note if targeting Quebec
- Reference Canadian shipping if physical products

Return as JSON with this structure:
{
  "hero": { "headline": "", "subheadline": "", "cta": "" },
  "problems": ["", "", ""],
  "solution": "",
  "benefits": [{ "icon": "", "title": "", "description": "" }],
  "howItWorks": [{ "step": 1, "title": "", "description": "" }],
  "testimonialTemplate": { "quote": "", "name": "", "location": "" },
  "pricing": [{ "tier": "", "price": "", "features": [] }],
  "faq": [{ "question": "", "answer": "" }],
  "finalCta": { "headline": "", "subheadline": "", "buttonText": "" },
  "canadianNotes": []
}`,

  facebook_ad: (idea: AssetRequest['idea']) => `
You are a Facebook Ads expert specializing in Canadian small business advertising.

Create 3 Facebook ad variations for this Canadian business:

**Business:** ${idea.name}
**Description:** ${idea.description}
**Industry:** ${idea.industry}
**Province:** ${idea.province}
**Competitors:** ${idea.competitors?.join(', ') || 'Not specified'}

For each ad variation, provide:
1. **Primary Text** (125 characters max for mobile)
2. **Headline** (40 characters max)
3. **Description** (30 characters max)
4. **Call-to-Action** (Learn More, Shop Now, Sign Up, etc.)
5. **Image Suggestion** (describe the ideal image)
6. **Target Audience** (demographics, interests)

IMPORTANT Canadian considerations:
- Target Canadian audiences (mention "Canada" or province)
- Use CAD for any pricing
- Reference Canadian pain points/seasons
- Consider French version for Quebec targeting

Return as JSON:
{
  "ads": [
    {
      "variation": "A",
      "primaryText": "",
      "headline": "",
      "description": "",
      "cta": "",
      "imageSuggestion": "",
      "targetAudience": {
        "location": "",
        "age": "",
        "interests": [],
        "behaviors": []
      }
    }
  ],
  "budgetRecommendation": "",
  "canadianNotes": []
}`,

  google_ad: (idea: AssetRequest['idea']) => `
You are a Google Ads expert specializing in Canadian small business advertising.

Create Google Search Ads for this Canadian business:

**Business:** ${idea.name}
**Description:** ${idea.description}
**Industry:** ${idea.industry}
**Province:** ${idea.province}

Provide:
1. **3 Headlines** (30 characters each max)
2. **2 Descriptions** (90 characters each max)
3. **Display URL path** (2 paths, 15 chars each)
4. **10 Keyword suggestions** (with match types)
5. **Negative keywords** (5-10)
6. **Ad extensions suggestions**

IMPORTANT Canadian considerations:
- Include location targeting (Canada, specific provinces)
- Use CAD for any pricing mentions
- Include Canadian-specific keywords
- Consider ".ca" domain suggestions

Return as JSON:
{
  "headlines": ["", "", ""],
  "descriptions": ["", ""],
  "displayPath": ["", ""],
  "keywords": [{ "keyword": "", "matchType": "exact|phrase|broad" }],
  "negativeKeywords": [],
  "extensions": {
    "sitelinks": [{ "title": "", "description": "" }],
    "callouts": [],
    "structuredSnippets": []
  },
  "bidRecommendation": "",
  "canadianNotes": []
}`,

  email_sequence: (idea: AssetRequest['idea']) => `
You are an email marketing expert specializing in Canadian businesses. You must ensure CASL (Canadian Anti-Spam Legislation) compliance.

Create a 5-email welcome/nurture sequence for this Canadian business:

**Business:** ${idea.name}
**Description:** ${idea.description}
**Industry:** ${idea.industry}
**Province:** ${idea.province}

For each email provide:
1. **Subject Line** (50 chars max, with emoji option)
2. **Preview Text** (90 chars max)
3. **Email Body** (conversational, 150-250 words)
4. **Call-to-Action**
5. **Send Timing** (days after signup)

CASL Compliance Requirements (MUST include):
- Clear sender identification
- Physical mailing address
- Unsubscribe mechanism mention
- Express consent acknowledgment

Email Sequence:
1. Welcome Email (Day 0)
2. Value/Education Email (Day 2)
3. Social Proof Email (Day 5)
4. Offer/Promotion Email (Day 7)
5. Re-engagement Email (Day 14)

Return as JSON:
{
  "emails": [
    {
      "number": 1,
      "name": "Welcome Email",
      "sendDay": 0,
      "subjectLine": "",
      "subjectLineWithEmoji": "",
      "previewText": "",
      "body": "",
      "cta": { "text": "", "url": "" }
    }
  ],
  "caslCompliance": {
    "senderName": "",
    "physicalAddress": "[Your Business Address]",
    "unsubscribeText": "",
    "consentNote": ""
  },
  "canadianNotes": []
}`,

  brand_brief: (idea: AssetRequest['idea']) => `
You are a brand strategist specializing in Canadian small businesses.

Create a comprehensive brand brief for this Canadian business:

**Business:** ${idea.name}
**Description:** ${idea.description}
**Industry:** ${idea.industry}
**Province:** ${idea.province}
**Competitors:** ${idea.competitors?.join(', ') || 'Not specified'}

Provide:
1. **Brand Positioning Statement**
2. **Mission Statement** (1-2 sentences)
3. **Vision Statement** (1-2 sentences)
4. **Brand Values** (5 core values with descriptions)
5. **Target Audience Personas** (2 detailed personas)
6. **Brand Voice & Tone** (with examples)
7. **Key Messages** (3-5 main messages)
8. **Tagline Options** (3 options)
9. **Visual Identity Suggestions** (colors, fonts, style)
10. **Competitive Differentiation**

Canadian Brand Considerations:
- Bilingual considerations (English/French)
- Canadian cultural values (diversity, inclusivity)
- Regional identity (if province-specific)
- Canadian trust signals

Return as JSON:
{
  "positioning": "",
  "mission": "",
  "vision": "",
  "values": [{ "value": "", "description": "" }],
  "personas": [{ "name": "", "age": "", "occupation": "", "painPoints": [], "goals": [] }],
  "voiceAndTone": { "voice": "", "tone": "", "examples": { "do": [], "dont": [] } },
  "keyMessages": [],
  "taglines": [],
  "visualIdentity": { "primaryColors": [], "secondaryColors": [], "fonts": { "heading": "", "body": "" }, "style": "" },
  "differentiation": "",
  "canadianNotes": []
}`,

  licensing_checklist: (idea: AssetRequest['idea']) => `
You are a Canadian business registration and compliance expert.

Create a comprehensive licensing and registration checklist for this Canadian business:

**Business:** ${idea.name}
**Description:** ${idea.description}
**Industry:** ${idea.industry}
**Province:** ${idea.province}

Provide a detailed checklist including:

1. **Federal Requirements**
   - Business Number (BN) registration with CRA
   - GST/HST registration (if applicable)
   - Payroll accounts
   - Import/Export licenses

2. **Provincial Requirements for ${idea.province}**
   - Provincial business registration
   - Provincial tax requirements
   - Industry-specific licenses
   - Health & safety requirements

3. **Municipal Requirements**
   - Business license
   - Zoning permits
   - Signage permits
   - Home-based business permits (if applicable)

4. **Industry-Specific Licenses**
   - Professional certifications
   - Health permits (food service)
   - Safety certifications

5. **Insurance Requirements**
   - General liability
   - Professional liability
   - Product liability
   - Workers compensation

6. **Ongoing Compliance**
   - Annual filings
   - Renewal dates
   - Record keeping requirements

Return as JSON:
{
  "federal": [{ "item": "", "description": "", "website": "", "estimatedCost": "", "timeline": "" }],
  "provincial": [{ "item": "", "description": "", "website": "", "estimatedCost": "", "timeline": "" }],
  "municipal": [{ "item": "", "description": "", "estimatedCost": "", "timeline": "" }],
  "industrySpecific": [{ "item": "", "description": "", "required": true, "estimatedCost": "" }],
  "insurance": [{ "type": "", "description": "", "estimatedAnnualCost": "", "required": true }],
  "ongoingCompliance": [{ "item": "", "frequency": "", "deadline": "" }],
  "totalEstimatedCost": "",
  "totalEstimatedTime": "",
  "canadianNotes": []
}`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { idea, assetType }: AssetRequest = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!idea || !assetType) {
      throw new Error("Missing required fields: idea, assetType");
    }

    const promptFn = assetPrompts[assetType];
    if (!promptFn) {
      throw new Error(`Unknown asset type: ${assetType}`);
    }

    const prompt = promptFn(idea);

    console.log(`Generating ${assetType} asset for idea: ${idea.name}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are an expert business asset generator. Always return valid JSON. Do not include markdown code blocks, just return the raw JSON object.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response
    let asset;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      asset = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse asset content");
    }

    return new Response(
      JSON.stringify({
        success: true,
        assetType,
        ideaId: idea.id,
        ideaName: idea.name,
        generatedAt: new Date().toISOString(),
        asset,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Generate assets error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
