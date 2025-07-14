import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
});

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      service,
      serviceDetails,
      contactInfo,
      files,
      amount,
      currency = 'MAD'
    } = req.body;

    if (!service || !serviceDetails || !contactInfo || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create Stripe payment session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: `${service} Service`,
              description: `Booking for ${service}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment/cancel`,
      customer_email: contactInfo.email,
      metadata: {
        service,
        booking_id: '', // Will be updated after booking creation
        customer_name: contactInfo.name,
        customer_phone: contactInfo.phone || '',
      },
    });

    // Store booking information
    const booking = {
      service,
      service_details: serviceDetails,
      contact_info: contactInfo,
      files: files || [],
      amount: Math.round(amount * 100),
      currency,
      status: 'pending',
      stripe_session_id: session.id,
      created_at: new Date().toISOString(),
    };

    // Here you would store the booking in your database
    // For now, we'll just return the session URL
    
    return res.status(200).json({
      payment_url: session.url,
      session_id: session.id
    });

  } catch (error: any) {
    console.error('Payment creation error:', error);
    return res.status(500).json({
      error: 'Error creating payment session',
      details: error.message
    });
  }
}
