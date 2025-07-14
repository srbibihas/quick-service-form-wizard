// @ts-nocheck
// deno-lint-ignore-file
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DODO_API_KEY = Deno.env.get('DODO_API_KEY') ?? '';
const DODO_API_URL = 'https://api.dodo.dev/v1';

async function createDodoPayment(amount: number, currency: string, metadata: any) {
  const response = await fetch(`${DODO_API_URL}/payments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DODO_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100),
      currency,
      metadata,
      success_url: `${Deno.env.get('PUBLIC_URL')}/payment-success`,
      cancel_url: `${Deno.env.get('PUBLIC_URL')}/payment-cancel`,
      webhook_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/dodo-webhook`,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`DODO payment creation failed: ${JSON.stringify(error)}`);
  }

  return await response.json();
}

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

    // Create DODO payment
    const dodoPayment = await createDodoPayment(amount, currency, {
      booking_id: booking.id,
      service,
      customer_name: contactInfo.name,
      customer_email: contactInfo.email,
      customer_phone: contactInfo.phone
    });

    // Update booking with payment details
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        dodo_payment_id: dodoPayment.id,
        payment_details: dodoPayment
      })
      .eq('id', booking.id);

    if (updateError) {
      console.error('Error updating booking with payment details:', updateError);
    } else {
      console.log('Booking updated with payment details successfully');
    }

    // Send booking notification using existing notification function
    const { error: notificationError } = await supabase
      .functions.invoke('send-notification', {
        body: {
          type: 'booking_created',
          booking_id: booking.id,
          contact_info: contactInfo,
          service_details: {
            service,
            ...serviceDetails,
            amount: (amount).toFixed(2),
            currency
          }
        }
      });

    if (notificationError) {
      console.error('Notification error:', notificationError);
      // Don't throw, as this is not critical for payment flow
    }

    console.log('=== CREATE PAYMENT FUNCTION COMPLETED ===');

    return new Response(JSON.stringify({
      payment_url: dodoPayment.checkout_url,
      booking_id: booking.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('=== CREATE PAYMENT FUNCTION ERROR ===');
    console.error('Error in create-payment function:', error);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error', 
      message: error.message,
      name: error.name,
      stack: error.stack 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
