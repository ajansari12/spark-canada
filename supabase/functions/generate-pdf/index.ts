import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GENERATE-PDF] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    const { ideaId } = await req.json();
    if (!ideaId) throw new Error("Idea ID is required");
    logStep("Idea ID received", { ideaId });

    // Fetch the idea
    const { data: idea, error: ideaError } = await supabaseClient
      .from("ideas")
      .select("*")
      .eq("id", ideaId)
      .eq("user_id", user.id)
      .single();

    if (ideaError || !idea) {
      throw new Error("Idea not found or access denied");
    }
    logStep("Idea fetched", { name: idea.name });

    // Generate enhanced content using Lovable AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const aiPrompt = `Generate a professional executive summary for this business idea. Keep it to 2-3 paragraphs.

IMPORTANT: Write in plain text only. Do NOT use any markdown formatting like **bold**, *italics*, ## headers, or bullet points. Just write natural flowing paragraphs.

Business Name: ${idea.name}
Description: ${idea.description}
Industry: ${idea.industry || "General"}
Province: ${idea.province || "Canada"}
Startup Cost: $${idea.startup_cost_min?.toLocaleString() || "N/A"} - $${idea.startup_cost_max?.toLocaleString() || "N/A"}
Monthly Revenue: $${idea.monthly_revenue_min?.toLocaleString() || "N/A"} - $${idea.monthly_revenue_max?.toLocaleString() || "N/A"}
Viability Score: ${idea.viability_score || "N/A"}/100

Write a compelling executive summary that a bank or investor would find professional. Use plain text only, no markdown.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a professional business plan writer." },
          { role: "user", content: aiPrompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      logStep("AI error", { status: aiResponse.status, error: errorText });
      throw new Error("Failed to generate content with AI");
    }

    const aiData = await aiResponse.json();
    let executiveSummary = aiData.choices?.[0]?.message?.content || "Executive summary not available.";
    
    // Clean up any markdown that might have slipped through
    executiveSummary = executiveSummary
      .replace(/\*\*([^*]+)\*\*/g, '$1')  // Remove **bold** markers
      .replace(/\*([^*]+)\*/g, '$1')      // Remove *italic* markers
      .replace(/^##\s*/gm, '')            // Remove ## headers
      .replace(/^#\s*/gm, '')             // Remove # headers
      .replace(/^-\s*/gm, '')             // Remove bullet points
      .replace(/^\d+\.\s*/gm, '');        // Remove numbered lists
    
    logStep("AI content generated");

    // Generate HTML content for PDF
    const quickWins = Array.isArray(idea.quick_wins) ? idea.quick_wins : [];
    const competitors = Array.isArray(idea.competitors) ? idea.competitors : [];
    const grants = Array.isArray(idea.grants) ? idea.grants : [];

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; line-height: 1.6; padding: 40px; }
    .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #f97316; padding-bottom: 30px; }
    .logo { font-size: 28px; font-weight: bold; color: #f97316; margin-bottom: 10px; }
    h1 { font-size: 32px; margin-bottom: 10px; color: #1a1a1a; }
    .subtitle { color: #666; font-size: 16px; }
    .section { margin-bottom: 30px; }
    .section-title { font-size: 20px; font-weight: bold; color: #f97316; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
    .metrics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
    .metric-card { background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #f97316; }
    .metric-label { font-size: 12px; text-transform: uppercase; color: #666; margin-bottom: 5px; }
    .metric-value { font-size: 24px; font-weight: bold; color: #1a1a1a; }
    .score-bar { height: 8px; background: #eee; border-radius: 4px; margin-top: 8px; }
    .score-fill { height: 100%; background: linear-gradient(90deg, #f97316, #fb923c); border-radius: 4px; }
    .content-box { background: #fff; border: 1px solid #eee; padding: 20px; border-radius: 8px; margin-bottom: 15px; }
    ul { padding-left: 20px; }
    li { margin-bottom: 8px; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px; }
    .page-break { page-break-before: always; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">SPARK</div>
    <h1>${idea.name}</h1>
    <p class="subtitle">${idea.industry || "Business"} | ${idea.province || "Canada"}</p>
  </div>

  <div class="metrics-grid">
    <div class="metric-card">
      <div class="metric-label">Startup Investment</div>
      <div class="metric-value">$${idea.startup_cost_min?.toLocaleString() || "N/A"} - $${idea.startup_cost_max?.toLocaleString() || "N/A"}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Monthly Revenue Potential</div>
      <div class="metric-value">$${idea.monthly_revenue_min?.toLocaleString() || "N/A"} - $${idea.monthly_revenue_max?.toLocaleString() || "N/A"}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Viability Score</div>
      <div class="metric-value">${idea.viability_score || "N/A"}/100</div>
      <div class="score-bar"><div class="score-fill" style="width: ${idea.viability_score || 0}%"></div></div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Market Fit Score</div>
      <div class="metric-value">${idea.market_fit_score || "N/A"}/100</div>
      <div class="score-bar"><div class="score-fill" style="width: ${idea.market_fit_score || 0}%"></div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Executive Summary</div>
    <div class="content-box">
      <p>${executiveSummary.replace(/\n/g, "</p><p>")}</p>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Business Description</div>
    <div class="content-box">
      <p>${idea.description}</p>
    </div>
  </div>

  ${quickWins.length > 0 ? `
  <div class="section">
    <div class="section-title">Quick Wins (First 90 Days)</div>
    <div class="content-box">
      <ul>
        ${quickWins.map((win: any) => `<li><strong>${win.title || win}</strong>${win.description ? `: ${win.description}` : ""}</li>`).join("")}
      </ul>
    </div>
  </div>
  ` : ""}

  ${competitors.length > 0 ? `
  <div class="section page-break">
    <div class="section-title">Competitive Analysis</div>
    <div class="content-box">
      <ul>
        ${competitors.map((comp: any) => `<li><strong>${comp.name || comp}</strong>${comp.description ? `: ${comp.description}` : ""}</li>`).join("")}
      </ul>
    </div>
  </div>
  ` : ""}

  ${grants.length > 0 ? `
  <div class="section">
    <div class="section-title">Available Grants & Funding</div>
    <div class="content-box">
      <ul>
        ${grants.map((grant: any) => `<li><strong>${grant.name || grant}</strong>${grant.description ? `: ${grant.description}` : ""}</li>`).join("")}
      </ul>
    </div>
  </div>
  ` : ""}

  <div class="footer">
    <p>Generated by SPARK Business Idea Generator</p>
    <p>Generated on ${new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}</p>
  </div>
</body>
</html>
    `;

    // Create document record
    const fileName = `${idea.name.replace(/[^a-zA-Z0-9]/g, "_")}_Business_Plan.html`;
    const filePath = `${user.id}/${fileName}`;

    // Upload HTML to storage
    const { error: uploadError } = await supabaseClient.storage
      .from("documents")
      .upload(filePath, htmlContent, {
        contentType: "text/html",
        upsert: true,
      });

    if (uploadError) {
      logStep("Upload error", { error: uploadError.message });
      throw new Error(`Failed to upload document: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabaseClient.storage
      .from("documents")
      .getPublicUrl(filePath);

    const fileUrl = urlData.publicUrl;
    logStep("File uploaded", { fileUrl });

    // Save document record
    const { data: docRecord, error: docError } = await supabaseClient
      .from("documents")
      .insert({
        user_id: user.id,
        idea_id: ideaId,
        document_type: "business_plan",
        file_url: fileUrl,
        file_name: fileName,
        status: "completed",
      })
      .select()
      .single();

    if (docError) {
      logStep("Document record error", { error: docError.message });
      throw new Error(`Failed to save document record: ${docError.message}`);
    }

    logStep("Document created successfully", { documentId: docRecord.id });

    return new Response(JSON.stringify({ 
      success: true, 
      document: docRecord,
      downloadUrl: fileUrl 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
