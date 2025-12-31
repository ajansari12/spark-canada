import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[SCHEDULED-EMAILS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const resend = new Resend(resendKey);
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // 1. Check for grant deadlines in the next 7 days
    logStep("Checking for upcoming grant deadlines");
    const { data: upcomingGrants, error: grantsError } = await supabase
      .from("grants")
      .select("id, name, deadline, province")
      .eq("is_active", true)
      .gte("deadline", now.toISOString().split("T")[0])
      .lte("deadline", sevenDaysFromNow.toISOString().split("T")[0]);

    if (grantsError) {
      logStep("Error fetching grants", { error: grantsError.message });
    } else {
      logStep("Found upcoming grants", { count: upcomingGrants?.length || 0 });
    }

    // 2. Get users with saved ideas that match upcoming grants
    if (upcomingGrants && upcomingGrants.length > 0) {
      const provinces = [...new Set(upcomingGrants.map((g) => g.province).filter(Boolean))];

      const { data: matchingIdeas, error: ideasError } = await supabase
        .from("ideas")
        .select("user_id, province")
        .eq("is_saved", true)
        .in("province", provinces);

      if (ideasError) {
        logStep("Error fetching matching ideas", { error: ideasError.message });
      } else {
        logStep("Found matching ideas", { count: matchingIdeas?.length || 0 });

        // Get unique user IDs
        const userIds = [...new Set(matchingIdeas?.map((i) => i.user_id) || [])];

        // Fetch user emails
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, email, province")
          .in("id", userIds);

        if (profilesError) {
          logStep("Error fetching profiles", { error: profilesError.message });
        } else {
          logStep("Sending grant deadline alerts", { userCount: profiles?.length || 0 });

          // Send emails to each user
          for (const profile of profiles || []) {
            if (!profile.email) continue;

            const relevantGrants = upcomingGrants.filter(
              (g) => g.province === profile.province || g.province === null
            );

            if (relevantGrants.length === 0) continue;

            const grantList = relevantGrants
              .map(
                (g) =>
                  `• ${g.name} - Deadline: ${new Date(g.deadline!).toLocaleDateString("en-CA")}`
              )
              .join("\n");

            try {
              await resend.emails.send({
                from: "SPARK Business Buddy <onboarding@resend.dev>",
                to: [profile.email],
                subject: `🚨 ${relevantGrants.length} Grant Deadline${relevantGrants.length > 1 ? "s" : ""} Coming Up!`,
                html: `
                  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #f97316;">Grant Deadline Alert</h1>
                    <p>Hi there!</p>
                    <p>Don't miss out! The following grants have deadlines in the next 7 days:</p>
                    <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
                      <pre style="white-space: pre-wrap; font-family: sans-serif;">${grantList}</pre>
                    </div>
                    <p>Log in to SPARK Business Buddy to review these grants and start your application!</p>
                    <a href="https://sparkbusinessbuddy.com/app/grants" 
                       style="display: inline-block; background: linear-gradient(135deg, #f97316, #ec4899); color: white; padding: 12px 24px; border-radius: 24px; text-decoration: none; margin-top: 16px;">
                      View Grants
                    </a>
                    <p style="color: #64748b; font-size: 12px; margin-top: 32px;">
                      You're receiving this because you have saved ideas in SPARK Business Buddy.
                    </p>
                  </div>
                `,
              });
              logStep("Sent grant alert email", { to: profile.email });
            } catch (emailError) {
              logStep("Error sending email", { to: profile.email, error: String(emailError) });
            }
          }
        }
      }
    }

    // 3. Weekly digest (if it's Monday)
    const dayOfWeek = now.getDay();
    if (dayOfWeek === 1) {
      logStep("Monday - sending weekly digests");

      // Get users with recent activity
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const { data: activeUsers, error: activeError } = await supabase
        .from("ideas")
        .select("user_id")
        .gte("created_at", weekAgo.toISOString());

      if (activeError) {
        logStep("Error fetching active users", { error: activeError.message });
      } else {
        const activeUserIds = [...new Set(activeUsers?.map((i) => i.user_id) || [])];
        logStep("Found active users for digest", { count: activeUserIds.length });

        // Get profiles for these users
        const { data: digestProfiles } = await supabase
          .from("profiles")
          .select("id, email, full_name")
          .in("id", activeUserIds);

        for (const profile of digestProfiles || []) {
          if (!profile.email) continue;

          // Get user's idea count for the week
          const { count: ideaCount } = await supabase
            .from("ideas")
            .select("id", { count: "exact", head: true })
            .eq("user_id", profile.id)
            .gte("created_at", weekAgo.toISOString());

          try {
            await resend.emails.send({
              from: "SPARK Business Buddy <onboarding@resend.dev>",
              to: [profile.email],
              subject: "📊 Your Weekly SPARK Digest",
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                  <h1 style="color: #f97316;">Your Weekly Digest</h1>
                  <p>Hi ${profile.full_name || "there"}!</p>
                  <p>Here's what happened this week:</p>
                  <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
                    <p style="font-size: 24px; font-weight: bold; color: #f97316; margin: 0;">
                      ${ideaCount || 0}
                    </p>
                    <p style="color: #64748b; margin: 4px 0 0 0;">new ideas generated</p>
                  </div>
                  <p>Keep exploring and building your business!</p>
                  <a href="https://sparkbusinessbuddy.com/app/dashboard" 
                     style="display: inline-block; background: linear-gradient(135deg, #f97316, #ec4899); color: white; padding: 12px 24px; border-radius: 24px; text-decoration: none; margin-top: 16px;">
                    Go to Dashboard
                  </a>
                </div>
              `,
            });
            logStep("Sent weekly digest", { to: profile.email });
          } catch (emailError) {
            logStep("Error sending digest", { to: profile.email, error: String(emailError) });
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Scheduled emails processed" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
