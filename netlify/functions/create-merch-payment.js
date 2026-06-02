// AKE Records — Stripe Merch Payment Function
// Deploiement : Netlify Functions
// Variable requise dans Netlify : STRIPE_SECRET_KEY

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const ALLOWED_ORIGINS = [
  'https://akerecords.fr',
  'https://www.akerecords.fr',
];

// Prix officiels cote serveur (en centimes) — NE JAMAIS faire confiance au client
const PRICES = {
  tee: 3500, // 35,00 EUR par t-shirt
};
const SHIPPING = 500;      // 5,00 EUR
const FREE_SHIPPING_FROM = 8000; // livraison offerte des 80 EUR

function computeTotal(items) {
  let subtotal = 0;
  let count = 0;
  for (const it of items) {
    const qty = Math.max(1, Math.min(20, parseInt(it.qty) || 1));
    subtotal += PRICES.tee * qty;
    count += qty;
  }
  const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING;
  return { subtotal, shipping, total: subtotal + shipping, count };
}

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

  const { paymentMethodId, email, name, items, shippingAddress } = body;

  if (!paymentMethodId || !email || !name || !Array.isArray(items) || items.length === 0) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Champs requis manquants' }) };
  }

  const { subtotal, shipping, total, count } = computeTotal(items);

  // resume lisible des articles pour les metadata Stripe
  const itemsSummary = items.map((it) => {
    const qty = Math.max(1, parseInt(it.qty) || 1);
    return `${qty}x ${it.design || 'tee'}/${it.colorway || '-'} ${it.tee_color || ''} [${it.size || '-'}]`;
  }).join(' | ').slice(0, 480);

  try {
    let customer;
    const existing = await stripe.customers.list({ email, limit: 1 });
    if (existing.data.length > 0) {
      customer = existing.data[0];
    } else {
      customer = await stripe.customers.create({
        email,
        name,
        metadata: { source: 'akerecords.fr/merch' },
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'eur',
      customer: customer.id,
      payment_method: paymentMethodId,
      confirm: true,
      return_url: 'https://akerecords.fr/merch/',
      receipt_email: email,
      description: 'AKE Records - Merch (' + count + ' article' + (count > 1 ? 's' : '') + ')',
      shipping: shippingAddress ? {
        name,
        address: {
          line1: shippingAddress.line1 || '',
          line2: shippingAddress.line2 || '',
          postal_code: shippingAddress.postal_code || '',
          city: shippingAddress.city || '',
          country: shippingAddress.country || 'FR',
        },
      } : undefined,
      metadata: {
        customer_name: name,
        customer_email: email,
        order_type: 'merch',
        items: itemsSummary,
        item_count: String(count),
        subtotal_eur: (subtotal / 100).toFixed(2),
        shipping_eur: (shipping / 100).toFixed(2),
        total_eur: (total / 100).toFixed(2),
      },
    });

    if (paymentIntent.status === 'requires_action') {
      return { statusCode: 200, headers, body: JSON.stringify({ requiresAction: true, clientSecret: paymentIntent.client_secret, total }) };
    }
    if (paymentIntent.status !== 'succeeded') {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Paiement refuse' }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, paymentIntentId: paymentIntent.id, total }) };

  } catch (err) {
    console.error('Stripe merch error:', err);
    return { statusCode: 400, headers, body: JSON.stringify({ error: err.message || 'Erreur Stripe' }) };
  }
};
