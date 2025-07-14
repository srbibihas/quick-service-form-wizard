
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-dodo-signature');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify DODO signature
    const signature = req.headers['x-dodo-signature'];
    if (!signature || signature !== process.env.DODO_WEBHOOK_SECRET) {
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    const event = req.body;
    console.log('Webhook event received:', JSON.stringify(event, null, 2));

    const { type, data } = event;

    switch (type) {
      case 'payment.succeeded':
        // Handle successful payment
        console.log('Payment succeeded:', data);
        
        // Here you would update your database with the payment status
        // and send confirmation emails/notifications
        
        // Extract metadata
        const metadata = data.metadata || {};
        console.log('Processing successful payment for:', {
          service: metadata.service,
          customer_name: metadata.customer_name,
          customer_email: metadata.customer_email,
          amount: data.amount / 100,
          currency: data.currency
        });
        
        break;
        
      case 'payment.failed':
        // Handle failed payment
        console.log('Payment failed:', data);
        break;
        
      default:
        console.log(`Unhandled event type: ${type}`);
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(400).json({ error: 'Webhook processing failed' });
  }
}
