import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const resendKey = Deno.env.get("RESEND_API_KEY");
    
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }
    
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET not configured");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const resend = resendKey ? new Resend(resendKey) : null;
    
    // Get the raw body for signature verification
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      throw new Error("No stripe-signature header found");
    }
    
    logStep("Verifying webhook signature");

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      logStep("Signature verified successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      logStep("Signature verification failed", { error: message });
      throw new Error(`Webhook signature verification failed: ${message}`);
    }
    
    logStep("Event type", { type: event.type });

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Subscription updated", { 
          customerId: subscription.customer,
          status: subscription.status 
        });
        
        // Get customer email to find user
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        if (customer.deleted) break;
        
        logStep("Customer found", { email: customer.email });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Subscription cancelled", { 
          customerId: subscription.customer,
          cancelledAt: subscription.canceled_at 
        });
        
        // Get customer email
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        if (customer.deleted) break;
        
        logStep("Subscription ended for", { email: customer.email });
        
        // Send cancellation email
        if (resend && customer.email) {
          try {
            await resend.emails.send({
              from: "Spark Business Buddy <onboarding@resend.dev>",
              to: [customer.email],
              subject: "Your subscription has been cancelled",
              html: `
                <h1>Subscription Cancelled</h1>
                <p>Hi there,</p>
                <p>Your Spark Business Buddy subscription has been cancelled.</p>
                <p>We're sorry to see you go! If you change your mind, you can always resubscribe from your account.</p>
                <p>If you have any feedback or questions, please don't hesitate to reach out.</p>
                <p>Best regards,<br>The Spark Business Buddy Team</p>
              `,
            });
            logStep("Cancellation email sent", { email: customer.email });
          } catch (emailError) {
            logStep("Failed to send cancellation email", { error: emailError });
          }
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("Payment succeeded", { 
          customerId: invoice.customer,
          amount: invoice.amount_paid 
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("Payment failed", { 
          customerId: invoice.customer,
          attemptCount: invoice.attempt_count 
        });
        
        // Get customer email and send notification
        const failedCustomer = await stripe.customers.retrieve(invoice.customer as string);
        if (!failedCustomer.deleted && resend && failedCustomer.email) {
          try {
            await resend.emails.send({
              from: "Spark Business Buddy <onboarding@resend.dev>",
              to: [failedCustomer.email],
              subject: "Payment Failed - Action Required",
              html: `
                <h1>Payment Failed</h1>
                <p>Hi there,</p>
                <p>We were unable to process your payment for Spark Business Buddy.</p>
                <p><strong>Attempt ${invoice.attempt_count}</strong> - Please update your payment method to continue enjoying our services.</p>
                <p>You can update your payment information by logging into your account and visiting the subscription settings.</p>
                <p>If you need any assistance, please don't hesitate to reach out.</p>
                <p>Best regards,<br>The Spark Business Buddy Team</p>
              `,
            });
            logStep("Payment failed email sent", { email: failedCustomer.email });
          } catch (emailError) {
            logStep("Failed to send payment failed email", { error: emailError });
          }
        }
        break;
      }

      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Checkout completed", { 
          customerId: session.customer,
          mode: session.mode 
        });
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
