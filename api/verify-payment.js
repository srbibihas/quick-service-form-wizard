
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { payment_id } = req.query;

  if (!payment_id) {
    return res.status(400).json({ error: 'Payment ID is required' });
  }

  try {
    // Verify payment status with DODO
    const dodoResponse = await fetch(`https://api.dodopayments.com/v1/payments/${payment_id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.DODO_API_KEY}`,
      },
    });

    if (!dodoResponse.ok) {
      throw new Error('Failed to verify payment with DODO');
    }

    const paymentData = await dodoResponse.json();
    
    return res.status(200).json({ 
      status: paymentData.status,
      payment_details: paymentData 
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({ error: 'Error verifying payment' });
  }
}
