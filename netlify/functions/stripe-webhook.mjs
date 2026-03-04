import { getStore } from "@netlify/blobs";
import Stripe from "stripe";

// License key format: OWNIV-XXXXX-XXXXX-XXXXX-XXXXX
// Excludes confusable characters: 0/O, 1/I/L
function generateLicenseKey() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const segment = () => {
    let s = "";
    for (let i = 0; i < 5; i++) {
      s += chars[Math.floor(Math.random() * chars.length)];
    }
    return s;
  };
  return `OWNIV-${segment()}-${segment()}-${segment()}-${segment()}`;
}

export default async (request, context) => {
  if (request.method === "OPTIONS") {
    return new Response("OK", { status: 200 });
  }
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const stripeSecretKey = Netlify.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Netlify.env.get("STRIPE_WEBHOOK_SECRET");

  if (!stripeSecretKey || !webhookSecret) {
    console.error("Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET env vars");
    return new Response("Server configuration error", { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey);

  // Verify webhook signature
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Only handle checkout.session.completed
  if (event.type !== "checkout.session.completed") {
    return Response.json({ received: true, ignored: true });
  }

  const session = event.data.object;
  const customerEmail = session.customer_details?.email || session.customer_email || "unknown";
  const sessionId = session.id;

  // Idempotency: check if this session was already processed
  const licenses = getStore("licenses");
  const existingSessionKey = await licenses.get(`session_${sessionId}`, { type: "json" });
  if (existingSessionKey) {
    console.log(`Session ${sessionId} already processed, license: ${existingSessionKey}`);
    return Response.json({ received: true, duplicate: true });
  }

  // Generate unique license key (retry on collision)
  let licenseKey;
  let attempts = 0;
  do {
    licenseKey = generateLicenseKey();
    const existing = await licenses.get(licenseKey, { type: "json" });
    if (!existing) break;
    attempts++;
  } while (attempts < 5);

  if (attempts >= 5) {
    console.error("Failed to generate unique license key after 5 attempts");
    return new Response("Internal error", { status: 500 });
  }

  // Store license data
  const licenseData = {
    email: customerEmail,
    sessionId: sessionId,
    created: new Date().toISOString(),
    machineId: null,
    activated: false,
    activatedAt: null,
  };

  await licenses.setJSON(licenseKey, licenseData);
  await licenses.setJSON(`session_${sessionId}`, licenseKey);

  // Store email → license index for support lookups
  const existingEmailLicenses = await licenses.get(`email_${customerEmail}`, { type: "json" }) || [];
  existingEmailLicenses.push(licenseKey);
  await licenses.setJSON(`email_${customerEmail}`, existingEmailLicenses);

  console.log(`License generated: ${licenseKey} for ${customerEmail} (session: ${sessionId})`);

  return Response.json({ received: true, licenseKey });
};

export const config = {
  path: "/api/stripe-webhook",
};
