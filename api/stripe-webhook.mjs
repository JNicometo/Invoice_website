import { Redis } from "@upstash/redis";
import Stripe from "stripe";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

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

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET env var");
    return res.status(500).send("Server configuration error");
  }

  // Read raw body for signature verification
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  const body = Buffer.concat(chunks).toString("utf8");
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type !== "checkout.session.completed") {
    return res.json({ received: true, ignored: true });
  }

  const session = event.data.object;
  const customerEmail = session.customer_details?.email || session.customer_email || "unknown";
  const sessionId = session.id;

  // Idempotency check
  const existingSessionKey = await redis.get(`session_${sessionId}`);
  if (existingSessionKey) {
    return res.json({ received: true, duplicate: true });
  }

  // Generate unique license key
  let licenseKey;
  let attempts = 0;
  do {
    licenseKey = generateLicenseKey();
    const existing = await redis.get(licenseKey);
    if (!existing) break;
    attempts++;
  } while (attempts < 5);

  if (attempts >= 5) {
    return res.status(500).send("Internal error");
  }

  const licenseData = {
    email: customerEmail,
    sessionId,
    created: new Date().toISOString(),
    machineId: null,
    activated: false,
    activatedAt: null,
  };

  await redis.set(licenseKey, JSON.stringify(licenseData));
  await redis.set(`session_${sessionId}`, licenseKey);

  const existingEmailLicenses = (await redis.get(`email_${customerEmail}`)) || [];
  const emailList = typeof existingEmailLicenses === "string" ? JSON.parse(existingEmailLicenses) : existingEmailLicenses;
  emailList.push(licenseKey);
  await redis.set(`email_${customerEmail}`, JSON.stringify(emailList));

  console.log(`License generated: ${licenseKey} for ${customerEmail}`);
  return res.json({ received: true, licenseKey });
}
