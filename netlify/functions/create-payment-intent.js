// netlify/functions/create-payment-intent.js
// ⚠️ Déployer sur Netlify avec la variable d'env STRIPE_SECRET_KEY

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  const { paymentMethodId, paymentIntentId, email, name, paymentMode, bookingDetails } = body;
  if (!email || !name) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Champs requis manquants' }) };

  try {
    const existing = await stripe.customers.list({ email, limit: 1 });
    const customer = existing.data[0] || await stripe.customers.create({ email, name });

    if (paymentMode === 'onsite') {
      await stripe.paymentMethods.attach(paymentMethodId, { customer: customer.id });
      await stripe.customers.update(customer.id, { invoice_settings: { default_payment_method: paymentMethodId } });
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, isOnsite: true, isFirstBooking: true }) };
    }

    if (paymentIntentId) {
      const pi = await stripe.paymentIntents.confirm(paymentIntentId);
      if (pi.status === 'succeeded') return { statusCode: 200, headers, body: JSON.stringify({ success: true, isFirstBooking: true }) };
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Confirmation échouée après 3DS' }) };
    }

    const pastIntents = await stripe.paymentIntents.list({ customer: customer.id, limit: 20 });
    const isFirstBooking = !pastIntents.data.some(pi => pi.status === 'succeeded' && pi.metadata?.type === 'studio_booking');

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 10000, currency: 'eur',
      customer: customer.id, payment_method: paymentMethodId,
      confirm: true, return_url: 'https://akerecords.fr/studio.html?success=true',
      description: isFirstBooking ? 'AKE Records — Pack Bienvenu Studio' : 'AKE Records — Session Studio',
      metadata: { type: 'studio_booking', client_name: name, client_email: email,
        booking_date: bookingDetails?.date||'', booking_slot: bookingDetails?.slot||'',
        booking_beatmaker: bookingDetails?.beatmaker||'', is_first_booking: String(isFirstBooking) }
    });

    if (paymentIntent.status === 'requires_action') {
      return { statusCode: 200, headers, body: JSON.stringify({
        requiresAction: true, paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret, isFirstBooking
      })};
    }
    if (paymentIntent.status === 'requires_payment_method') {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Carte refusée. Essaie avec une autre carte.' }) };
    }
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, isFirstBooking, paymentIntentId: paymentIntent.id }) };

  } catch (err) {
    console.error('Stripe error:', err.message);
    return { statusCode: 400, headers, body: JSON.stringify({ error: err.message || 'Erreur de paiement' }) };
  }
};
