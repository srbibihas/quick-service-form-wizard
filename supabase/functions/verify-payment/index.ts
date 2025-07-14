// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { booking_id } = await req.json();

    console.log('Verifying payment for booking:', booking_id);

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', booking_id)
      .single();

    if (bookingError || !booking) {
      console.error('Booking not found:', bookingError);
      return new Response(JSON.stringify({ error: 'Booking not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!booking.dodo_payment_id) {
      return new Response(JSON.stringify({ error: 'No payment ID found' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify payment status with DODO
    const dodoApiKey = Deno.env.get('DODO_API_KEY');
    if (!dodoApiKey) {
      return new Response(JSON.stringify({ error: 'Payment gateway not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const dodoResponse = await fetch(`https://api.dodopayments.com/v1/payments/${booking.dodo_payment_id}`, {
      headers: {
        'Authorization': `Bearer ${dodoApiKey}`,
      },
    });

    const paymentStatus = await dodoResponse.json();
    console.log('DODO payment status:', paymentStatus);

    // Update booking status if payment is successful
    if (paymentStatus.status === 'succeeded') {
      await supabase
        .from('bookings')
        .update({ 
          status: 'paid',
          updated_at: new Date().toISOString()
        })
        .eq('id', booking_id);

      // Log successful payment
      await supabase
        .from('payment_logs')
        .insert({
          booking_id: booking_id,
          event_type: 'payment_verified',
          event_data: paymentStatus
        });
    }

    return new Response(JSON.stringify({
      booking: booking,
      payment_status: paymentStatus.status,
      payment_details: paymentStatus
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
