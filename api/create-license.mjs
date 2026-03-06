import { Redis } from "@upstash/redis";

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

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-secret");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  // Admin secret check — only you can create keys
  const adminSecret = req.headers["x-admin-secret"];
  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { email } = req.body || {};

  let licenseKey;
  let attempts = 0;
  do {
    licenseKey = generateLicenseKey();
    const existing = await redis.get(licenseKey);
    if (!existing) break;
    attempts++;
  } while (attempts < 5);

  if (attempts >= 5) {
    return res.status(500).json({ error: "Failed to generate unique key" });
  }

  const licenseData = {
    email: email || "manual",
    sessionId: "manual",
    created: new Date().toISOString(),
    machineId: null,
    activated: false,
    activatedAt: null,
  };

  await redis.set(licenseKey, JSON.stringify(licenseData));

  return res.json({ licenseKey, email: licenseData.email });
}
