import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature']!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Update booking status in your database
        await handlePaymentSuccess({
          session_id: session.id,
          customer_email: session.customer_email,
          amount: session.amount_total,
          currency: session.currency,
          metadata: session.metadata
        });
        
        break;
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return res.status(200).json({ received: true });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return res.status(500).json({
      error: 'Error processing webhook',
      details: error.message
    });
  }
}

async function buffer(req: NextApiRequest) {
  const chunks: Buffer[] = [];
  
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  
  return Buffer.concat(chunks);
}

async function handlePaymentSuccess(paymentData: {
  session_id: string;
  customer_email: string | null;
  amount: number | null;
  currency: string;
  metadata: Stripe.Metadata;
}) {
  // Here you would update your database with the payment status
  // and send notifications to the customer
  console.log('Processing successful payment:', paymentData);
}
