
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5';

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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify webhook signature if webhook secret is configured
    const webhookSecret = Deno.env.get('DODO_WEBHOOK_SECRET');
    if (webhookSecret) {
      const signature = req.headers.get('x-dodo-signature');
      const body = await req.text();
      
      // Create signature to verify
      const crypto = globalThis.crypto;
      const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(webhookSecret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      
      const expectedSignature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
      const expectedSigHex = Array.from(new Uint8Array(expectedSignature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      if (signature !== `sha256=${expectedSigHex}`) {
        console.error('Invalid webhook signature');
        return new Response('Invalid signature', { status: 401 });
      }
      
      // Parse the verified body
      const webhookData = JSON.parse(body);
      console.log('Verified webhook data:', webhookData);
      
      // Process the webhook
      return await processWebhook(supabase, webhookData);
    } else {
      // No webhook secret configured, process directly
      const webhookData = await req.json();
      console.log('Webhook data (no verification):', webhookData);
      
      return await processWebhook(supabase, webhookData);
    }

  } catch (error) {
    console.error('Error in dodo-webhook function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function processWebhook(supabase: any, webhookData: any) {
  const { event_type, data } = webhookData;
  
  console.log('Processing webhook event:', event_type, 'for payment:', data.id);

  // Find booking by payment ID
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('*')
    .eq('dodo_payment_id', data.id)
    .single();

  if (bookingError || !booking) {
    console.error('Booking not found for payment:', data.id);
    return new Response('Booking not found', { status: 404 });
  }

  // Log the webhook event
  await supabase
    .from('payment_logs')
    .insert({
      booking_id: booking.id,
      event_type: event_type,
      event_data: data
    });

  // Update booking status based on event type
  let newStatus = booking.status;
  
  switch (event_type) {
    case 'payment.succeeded':
    case 'payment.completed':
      newStatus = 'paid';
      break;
    case 'payment.failed':
      newStatus = 'failed';
      break;
    case 'payment.cancelled':
      newStatus = 'cancelled';
      break;
    case 'payment.pending':
      newStatus = 'pending';
      break;
    default:
      console.log('Unhandled event type:', event_type);
  }

  if (newStatus !== booking.status) {
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', booking.id);

    if (updateError) {
      console.error('Error updating booking status:', updateError);
    } else {
      console.log(`Updated booking ${booking.id} status to ${newStatus}`);
    }
  }

  return new Response('OK', { status: 200 });
}
