// AKE Records — Stripe Payment Function
// Deploiement : Netlify Functions
// Variable requise dans Netlify : STRIPE_SECRET_KEY

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const ALLOWED_ORIGINS = [
  'https://akerecords.fr',
  'https://www.akerecords.fr',
];

exports.handler = async (event) => {
  const origin = event.headers?.origin || '';
  const isAllowed = ALLOWED_ORIGINS.includes(origin) || origin.includes('netlify.app');

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { paymentMethodId, email, name, paymentMode, bookingDetails } = body;

  if (!paymentMethodId || !email || !name) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Champs requis manquants' }) };
  }

  try {
    let customer;
    const existing = await stripe.customers.list({ email, limit: 1 });
    if (existing.data.length > 0) {
      customer = existing.data[0];
    } else {
      customer = await stripe.customers.create({
        email,
        name,
        metadata: { source: 'akerecords.fr' },
      });
    }

    const isFirstBooking = !customer.metadata?.hasBooking;

    if (paymentMode === 'onsite') {
      const setupIntent = await stripe.setupIntents.create({
        customer: customer.id,
        payment_method: paymentMethodId,
        confirm: true,
        usage: 'off_session',
        metadata: {
          booking_date: bookingDetails?.date || '',
          booking_slot: bookingDetails?.slot || '',
          beatmaker: bookingDetails?.beatmaker || '',
          genre: bookingDetails?.genre || '',
          type: 'onsite_imprint',
        },
      });
      await stripe.customers.update(customer.id, { metadata: { hasBooking: 'true' } });
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, mode: 'onsite', setupIntentId: setupIntent.id, isFirstBooking }) };
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 10000,
      currency: 'eur',
      customer: customer.id,
      payment_method: paymentMethodId,
      confirm: true,
      return_url: 'https://akerecords.fr/studio.html',
      receipt_email: email,
      description: 'AKE Records - Pack Bienvenu Studio - ' + (bookingDetails?.date || ''),
      metadata: {
        customer_name: name,
        customer_email: email,
        booking_date: bookingDetails?.date || '',
        booking_slot: bookingDetails?.slot || '',
        beatmaker: bookingDetails?.beatmaker || '',
        genre: bookingDetails?.genre || '',
        is_first_booking: isFirstBooking ? 'oui' : 'non',
      },
    });

    if (paymentIntent.status === 'requires_action') {
      return { statusCode: 200, headers, body: JSON.stringify({ requiresAction: true, clientSecret: paymentIntent.client_secret, isFirstBooking }) };
    }
    if (paymentIntent.status !== 'succeeded') {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Paiement refuse' }) };
    }

    await stripe.customers.update(customer.id, { metadata: { hasBooking: 'true' } });
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, mode: 'online', paymentIntentId: paymentIntent.id, isFirstBooking }) };

  } catch (err) {
    console.error('Stripe error:', err);
    return { statusCode: 400, headers, body: JSON.stringify({ error: err.message || 'Erreur Stripe' }) };
  }
};
