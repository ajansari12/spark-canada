import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  template: 'welcome' | 'idea_generated' | 'action_plan_reminder' | 'grant_deadline' | 'weekly_digest';
  data?: Record<string, unknown>;
}

const emailTemplates = {
  welcome: {
    subject: "Welcome to SPARK Business Buddy!",
    getHtml: (data: Record<string, unknown>) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to SPARK</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 40px; border: 1px solid #333;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #f97316; font-size: 28px; margin: 0;">Welcome to SPARK!</h1>
              </div>

              <p style="color: #e5e5e5; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Hi${data.name ? ` ${data.name}` : ''},
              </p>

              <p style="color: #e5e5e5; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Welcome to SPARK Business Buddy - your AI-powered partner for discovering and launching your perfect Canadian business idea!
              </p>

              <p style="color: #e5e5e5; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Here's what you can do next:
              </p>

              <ul style="color: #a3a3a3; font-size: 14px; line-height: 1.8; padding-left: 20px; margin-bottom: 30px;">
                <li>Complete the business idea wizard to get personalized recommendations</li>
                <li>Explore Canadian grants and funding opportunities</li>
                <li>Chat with our AI to refine your business strategy</li>
                <li>Generate detailed business plans and action items</li>
              </ul>

              <div style="text-align: center; margin-top: 30px;">
                <a href="https://sparkbusinessbuddy.com/wizard" style="display: inline-block; background: #f97316; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                  Start Your Journey
                </a>
              </div>

              <p style="color: #737373; font-size: 12px; text-align: center; margin-top: 40px;">
                You're receiving this because you signed up for SPARK Business Buddy.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  },

  idea_generated: {
    subject: "Your New Business Ideas Are Ready!",
    getHtml: (data: Record<string, unknown>) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Business Ideas</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 40px; border: 1px solid #333;">
              <h1 style="color: #f97316; font-size: 24px; margin: 0 0 20px 0; text-align: center;">
                Your Business Ideas Are Ready!
              </h1>

              <p style="color: #e5e5e5; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Great news! We've generated ${data.ideaCount || 'some'} personalized business ideas based on your profile.
              </p>

              ${data.topIdea ? `
                <div style="background: #1f2937; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #f97316;">
                  <h3 style="color: #f97316; margin: 0 0 10px 0;">Top Recommendation</h3>
                  <p style="color: #e5e5e5; font-size: 18px; font-weight: 600; margin: 0 0 10px 0;">${data.topIdea}</p>
                  <p style="color: #a3a3a3; font-size: 14px; margin: 0;">
                    Viability Score: <span style="color: #22c55e; font-weight: 600;">${data.viabilityScore || 'N/A'}/100</span>
                  </p>
                </div>
              ` : ''}

              <div style="text-align: center; margin-top: 30px;">
                <a href="https://sparkbusinessbuddy.com/app/ideas" style="display: inline-block; background: #f97316; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                  View All Ideas
                </a>
              </div>

              <p style="color: #737373; font-size: 12px; text-align: center; margin-top: 40px;">
                You're receiving this because you generated business ideas on SPARK.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  },

  action_plan_reminder: {
    subject: "Action Plan Reminder: Keep Your Momentum Going!",
    getHtml: (data: Record<string, unknown>) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Action Plan Reminder</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 40px; border: 1px solid #333;">
              <h1 style="color: #f97316; font-size: 24px; margin: 0 0 20px 0; text-align: center;">
                Time to Check Your Progress!
              </h1>

              <p style="color: #e5e5e5; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Hi${data.name ? ` ${data.name}` : ''},
              </p>

              <p style="color: #e5e5e5; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                You're working on <strong style="color: #f97316;">${data.ideaName || 'your business idea'}</strong>.
                Here's a quick reminder of your upcoming tasks:
              </p>

              ${data.nextTask ? `
                <div style="background: #1f2937; border-radius: 12px; padding: 20px; margin: 20px 0;">
                  <h3 style="color: #22c55e; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase;">Next Task</h3>
                  <p style="color: #e5e5e5; font-size: 16px; margin: 0;">${data.nextTask}</p>
                </div>
              ` : ''}

              <div style="background: #1f2937; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <p style="color: #a3a3a3; margin: 0; font-size: 14px;">
                  Progress: <span style="color: #f97316; font-weight: 600;">${data.completedTasks || 0}/${data.totalTasks || 0}</span> tasks completed
                </p>
                <div style="background: #374151; border-radius: 4px; height: 8px; margin-top: 10px; overflow: hidden;">
                  <div style="background: #22c55e; height: 100%; width: ${data.progressPercent || 0}%;"></div>
                </div>
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <a href="https://sparkbusinessbuddy.com/app/ideas" style="display: inline-block; background: #f97316; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                  Continue Working
                </a>
              </div>

              <p style="color: #737373; font-size: 12px; text-align: center; margin-top: 40px;">
                You can manage your email preferences in Settings.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  },

  grant_deadline: {
    subject: "Grant Deadline Approaching!",
    getHtml: (data: Record<string, unknown>) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Grant Deadline</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 40px; border: 1px solid #333;">
              <div style="text-align: center; margin-bottom: 20px;">
                <span style="background: #dc2626; color: white; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: 600;">
                  DEADLINE ALERT
                </span>
              </div>

              <h1 style="color: #f97316; font-size: 24px; margin: 0 0 20px 0; text-align: center;">
                ${data.grantName || 'Grant'} Deadline Approaching
              </h1>

              <p style="color: #e5e5e5; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                The application deadline for <strong>${data.grantName || 'this grant'}</strong> is
                <strong style="color: #f97316;">${data.deadline || 'coming up soon'}</strong>.
              </p>

              <div style="background: #1f2937; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <p style="color: #22c55e; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">
                  Funding: ${data.fundingAmount || 'Varies'}
                </p>
                <p style="color: #a3a3a3; font-size: 14px; margin: 0;">
                  ${data.grantDescription || 'Check the grant details for eligibility requirements.'}
                </p>
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <a href="https://sparkbusinessbuddy.com/app/grants" style="display: inline-block; background: #f97316; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                  View Grant Details
                </a>
              </div>

              <p style="color: #737373; font-size: 12px; text-align: center; margin-top: 40px;">
                You can manage grant alerts in Settings.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  },

  weekly_digest: {
    subject: "Your SPARK Weekly Digest",
    getHtml: (data: Record<string, unknown>) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Weekly Digest</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 40px; border: 1px solid #333;">
              <h1 style="color: #f97316; font-size: 24px; margin: 0 0 20px 0; text-align: center;">
                Your Weekly SPARK Digest
              </h1>

              <p style="color: #e5e5e5; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Hi${data.name ? ` ${data.name}` : ''}! Here's what's happening with your business journey:
              </p>

              ${data.savedIdeasCount ? `
                <div style="display: flex; justify-content: space-between; padding: 15px; background: #1f2937; border-radius: 8px; margin-bottom: 10px;">
                  <span style="color: #a3a3a3;">Saved Ideas</span>
                  <span style="color: #f97316; font-weight: 600;">${data.savedIdeasCount}</span>
                </div>
              ` : ''}

              ${data.tasksCompleted ? `
                <div style="display: flex; justify-content: space-between; padding: 15px; background: #1f2937; border-radius: 8px; margin-bottom: 10px;">
                  <span style="color: #a3a3a3;">Tasks Completed This Week</span>
                  <span style="color: #22c55e; font-weight: 600;">${data.tasksCompleted}</span>
                </div>
              ` : ''}

              ${data.newGrantsCount ? `
                <div style="display: flex; justify-content: space-between; padding: 15px; background: #1f2937; border-radius: 8px; margin-bottom: 10px;">
                  <span style="color: #a3a3a3;">New Matching Grants</span>
                  <span style="color: #3b82f6; font-weight: 600;">${data.newGrantsCount}</span>
                </div>
              ` : ''}

              ${data.ideaOfTheWeek ? `
                <div style="background: #1f2937; border-radius: 12px; padding: 20px; margin: 30px 0; border-left: 4px solid #f97316;">
                  <h3 style="color: #f97316; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase;">
                    Canadian Idea of the Week
                  </h3>
                  <p style="color: #e5e5e5; font-size: 16px; margin: 0;">${data.ideaOfTheWeek}</p>
                </div>
              ` : ''}

              <div style="text-align: center; margin-top: 30px;">
                <a href="https://sparkbusinessbuddy.com/app/dashboard" style="display: inline-block; background: #f97316; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                  Go to Dashboard
                </a>
              </div>

              <p style="color: #737373; font-size: 12px; text-align: center; margin-top: 40px;">
                Unsubscribe from weekly digests in Settings.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  },
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, template, data = {} }: EmailRequest = await req.json();
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      throw new Error("Email service is not configured");
    }

    if (!to || !template) {
      throw new Error("Missing required fields: to, template");
    }

    const emailTemplate = emailTemplates[template];
    if (!emailTemplate) {
      throw new Error(`Unknown email template: ${template}`);
    }

    console.log(`Sending ${template} email to ${to}`);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "SPARK Business Buddy <noreply@sparkbusinessbuddy.com>",
        to: [to],
        subject: emailTemplate.subject,
        html: emailTemplate.getHtml(data),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Resend API error:", response.status, errorText);
      throw new Error(`Email sending failed: ${response.status}`);
    }

    const result = await response.json();
    console.log("Email sent successfully:", result.id);

    return new Response(
      JSON.stringify({ success: true, emailId: result.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Send email error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
