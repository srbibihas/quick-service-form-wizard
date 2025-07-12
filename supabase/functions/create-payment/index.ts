
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
    console.log('=== CREATE PAYMENT FUNCTION STARTED ===');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const requestBody = await req.json();
    console.log('Request body received:', JSON.stringify(requestBody, null, 2));

    const { service, serviceDetails, contactInfo, files, amount, currency = 'MAD' } = requestBody;

    // Validate required fields
    if (!service || !serviceDetails || !contactInfo || !amount) {
      console.error('Missing required fields:', { service, serviceDetails: !!serviceDetails, contactInfo: !!contactInfo, amount });
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Creating anonymous payment for service:', service, 'Amount:', amount, currency);

    // Create booking record without user_id (anonymous booking)
    const bookingData = {
      user_id: null, // Anonymous booking
      service,
      service_details: serviceDetails,
      contact_info: contactInfo,
      files: files || [],
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      status: 'pending'
    };

    console.log('Booking data to insert:', JSON.stringify(bookingData, null, 2));

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single();

    if (bookingError) {
      console.error('Error creating booking:', bookingError);
      return new Response(JSON.stringify({ error: 'Failed to create booking', details: bookingError }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Booking created successfully:', booking.id);

    // Check DODO API key
    const dodoApiKey = Deno.env.get('DODO_API_KEY');
    if (!dodoApiKey) {
      console.error('DODO API key not configured');
      return new Response(JSON.stringify({ error: 'Payment gateway not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('DODO API key found, length:', dodoApiKey.length);

    const origin = req.headers.get('origin') || 'https://id-preview--17118c64-4b66-4e46-8c8e-ac3c49f2decc.lovable.app';
    console.log('Request origin:', origin);

    const paymentData = {
      amount: amount,
      currency: currency,
      description: `${service} - ${contactInfo.name}`,
      customer_email: contactInfo.email,
      return_url: `${origin}/payment/success?booking=${booking.id}`,
      cancel_url: `${origin}/payment/cancel?booking=${booking.id}`,
      webhook_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/dodo-webhook`,
      metadata: {
        booking_id: booking.id,
        service: service
      }
    };

    console.log('DODO payment data:', JSON.stringify(paymentData, null, 2));

    const dodoResponse = await fetch('https://api.dodopayments.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${dodoApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    console.log('DODO API response status:', dodoResponse.status);
    console.log('DODO API response headers:', Object.fromEntries(dodoResponse.headers.entries()));

    const dodoResult = await dodoResponse.json();
    console.log('DODO API response body:', JSON.stringify(dodoResult, null, 2));

    if (!dodoResponse.ok) {
      console.error('DODO API error - Status:', dodoResponse.status, 'Response:', dodoResult);
      
      // Log the booking for manual follow-up
      await supabase
        .from('payment_logs')
        .insert({
          booking_id: booking.id,
          event_type: 'payment_creation_failed',
          event_data: { error: dodoResult, status: dodoResponse.status }
        });

      return new Response(JSON.stringify({ 
        error: 'Failed to create payment with provider', 
        details: dodoResult,
        booking_id: booking.id 
      }), {
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
    } else {
      console.log('Booking updated with payment details successfully');
    }

    // Log payment creation
    await supabase
      .from('payment_logs')
      .insert({
        booking_id: booking.id,
        event_type: 'payment_created',
        event_data: dodoResult
      });

    console.log('=== CREATE PAYMENT FUNCTION COMPLETED ===');

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
    console.error('=== CREATE PAYMENT FUNCTION ERROR ===');
    console.error('Error in create-payment function:', error);
    console.error('Error stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error', 
      message: error.message,
      stack: error.stack 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
