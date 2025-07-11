
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

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user from auth header
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authorization' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { booking_id } = await req.json();

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', booking_id)
      .eq('user_id', user.id)
      .single();

    if (bookingError || !booking) {
      return new Response(JSON.stringify({ error: 'Booking not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify payment status with DODO if we have a payment ID
    if (booking.dodo_payment_id) {
      const dodoApiKey = Deno.env.get('DODO_API_KEY');
      if (!dodoApiKey) {
        return new Response(JSON.stringify({ error: 'Payment gateway not configured' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const dodoResponse = await fetch(`https://api.dodopayments.com/v1/payments/${booking.dodo_payment_id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${dodoApiKey}`,
          'Content-Type': 'application/json',
        },
      });

      const paymentData = await dodoResponse.json();
      console.log('DODO payment status:', paymentData);

      // Update local status if it differs from DODO
      let updatedStatus = booking.status;
      if (paymentData.status === 'succeeded' || paymentData.status === 'completed') {
        updatedStatus = 'paid';
      } else if (paymentData.status === 'failed') {
        updatedStatus = 'failed';
      } else if (paymentData.status === 'cancelled') {
        updatedStatus = 'cancelled';
      }

      if (updatedStatus !== booking.status) {
        await supabase
          .from('bookings')
          .update({
            status: updatedStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', booking.id);

        // Log the status update
        await supabase
          .from('payment_logs')
          .insert({
            booking_id: booking.id,
            event_type: 'status_verified',
            event_data: paymentData
          });
      }

      return new Response(JSON.stringify({
        booking_id: booking.id,
        status: updatedStatus,
        payment_status: paymentData.status,
        amount: booking.amount / 100,
        currency: booking.currency
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // No payment ID, return current booking status
    return new Response(JSON.stringify({
      booking_id: booking.id,
      status: booking.status,
      amount: booking.amount / 100,
      currency: booking.currency
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in verify-payment function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
