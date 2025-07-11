
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

    const { service, serviceDetails, contactInfo, files, amount, currency = 'MAD' } = await req.json();

    console.log('Creating payment for user:', user.id, 'Amount:', amount, currency);

    // Create booking record first
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        service,
        service_details: serviceDetails,
        contact_info: contactInfo,
        files: files || [],
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        status: 'pending'
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Error creating booking:', bookingError);
      return new Response(JSON.stringify({ error: 'Failed to create booking' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create DODO payment
    const dodoApiKey = Deno.env.get('DODO_API_KEY');
    if (!dodoApiKey) {
      console.error('DODO API key not configured');
      return new Response(JSON.stringify({ error: 'Payment gateway not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const paymentData = {
      amount: amount,
      currency: currency,
      description: `${service} - ${contactInfo.name}`,
      customer_email: contactInfo.email,
      return_url: `${req.headers.get('origin')}/payment/success?booking=${booking.id}`,
      cancel_url: `${req.headers.get('origin')}/payment/cancel?booking=${booking.id}`,
      webhook_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/dodo-webhook`,
      metadata: {
        booking_id: booking.id,
        user_id: user.id,
        service: service
      }
    };

    console.log('Creating DODO payment with data:', paymentData);

    const dodoResponse = await fetch('https://api.dodopayments.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${dodoApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    const dodoResult = await dodoResponse.json();
    console.log('DODO API response:', dodoResult);

    if (!dodoResponse.ok) {
      console.error('DODO API error:', dodoResult);
      return new Response(JSON.stringify({ error: 'Failed to create payment', details: dodoResult }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update booking with DODO payment details
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        dodo_payment_id: dodoResult.id,
        dodo_checkout_url: dodoResult.checkout_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', booking.id);

    if (updateError) {
      console.error('Error updating booking with payment details:', updateError);
    }

    // Log payment creation
    await supabase
      .from('payment_logs')
      .insert({
        booking_id: booking.id,
        event_type: 'payment_created',
        event_data: dodoResult
      });

    return new Response(JSON.stringify({
      booking_id: booking.id,
      payment_id: dodoResult.id,
      checkout_url: dodoResult.checkout_url,
      amount: amount,
      currency: currency
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in create-payment function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
