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
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ error: 'Missing session ID' });
    }

    // Retrieve the session to confirm payment status
    const session = await stripe.checkout.sessions.retrieve(session_id as string);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Here you would update the booking status in your database
    // For now, we'll just return the success status

    return res.status(200).json({
      success: true,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email,
      amount_total: session.amount_total,
      currency: session.currency
    });

  } catch (error: any) {
    console.error('Payment verification error:', error);
    return res.status(500).json({
      error: 'Error verifying payment',
      details: error.message
    });
  }
}
