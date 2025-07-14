
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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

    // Create DODO payment
    const dodoResponse = await fetch('https://api.dodopayments.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DODO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency,
        success_url: `${process.env.NEXT_PUBLIC_URL || 'https://your-domain.vercel.app'}/payment-success`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL || 'https://your-domain.vercel.app'}/payment-cancel`,
        webhook_url: `${process.env.NEXT_PUBLIC_URL || 'https://your-domain.vercel.app'}/api/webhook`,
        metadata: {
          service,
          customer_name: contactInfo.name,
          customer_email: contactInfo.email,
          customer_phone: contactInfo.phone || '',
          service_details: JSON.stringify(serviceDetails),
          files: JSON.stringify(files || [])
        }
      }),
    });

    if (!dodoResponse.ok) {
      const error = await dodoResponse.json();
      throw new Error(`DODO payment creation failed: ${JSON.stringify(error)}`);
    }

    const paymentData = await dodoResponse.json();

    // Store booking information (you can integrate with your database here)
    console.log('Booking created:', {
      service,
      service_details: serviceDetails,
      contact_info: contactInfo,
      files: files || [],
      amount: Math.round(amount * 100),
      currency,
      dodo_payment_id: paymentData.id,
      status: 'pending'
    });

    return res.status(200).json({
      payment_url: paymentData.checkout_url,
      payment_id: paymentData.id
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    return res.status(500).json({
      error: 'Error creating payment session',
      details: error.message
    });
  }
}
