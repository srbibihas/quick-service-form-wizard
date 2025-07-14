// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DODO_WEBHOOK_SECRET = Deno.env.get('DODO_WEBHOOK_SECRET') ?? '';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== DODO WEBHOOK FUNCTION STARTED ===');

    // Verify DODO signature
    const signature = req.headers.get('x-dodo-signature');
    if (!signature || signature !== DODO_WEBHOOK_SECRET) {
      throw new Error('Invalid webhook signature');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const event = await req.json();
    console.log('Webhook event received:', JSON.stringify(event, null, 2));

    const { type, data } = event;
    const paymentId = data.id;
    const paymentStatus = data.status;

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('dodo_payment_id', paymentId)
      .single();

    if (bookingError) {
      throw bookingError;
    }

    // Update booking status
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        status: paymentStatus,
        payment_details: data
      })
      .eq('id', booking.id);

    if (updateError) {
      throw updateError;
    }

    // Send payment status notification using existing notification function
    const { error: notificationError } = await supabase
      .functions.invoke('send-notification', {
        body: {
          type: `payment_${paymentStatus}`,
          booking_id: booking.id,
          contact_info: booking.contact_info,
          service_details: {
            service: booking.service,
            ...booking.service_details,
            amount: (booking.amount / 100).toFixed(2),
            currency: booking.currency
          }
        }
      });

    if (notificationError) {
      console.error('Notification error:', notificationError);
      // Don't throw, as this is not critical for payment flow
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in dodo-webhook function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
