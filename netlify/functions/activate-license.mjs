import { getStore } from "@netlify/blobs";

export default async (request, context) => {
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response("OK", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { licenseKey, machineId } = body;

  if (!licenseKey || typeof licenseKey !== "string") {
    return Response.json({ error: "Missing or invalid licenseKey" }, { status: 400 });
  }
  if (!machineId || typeof machineId !== "string") {
    return Response.json({ error: "Missing or invalid machineId" }, { status: 400 });
  }

  // Normalize: uppercase, trim
  const normalizedKey = licenseKey.trim().toUpperCase();

  // Validate format
  const keyPattern = /^OWNIV-[A-Z2-9]{5}-[A-Z2-9]{5}-[A-Z2-9]{5}-[A-Z2-9]{5}$/;
  if (!keyPattern.test(normalizedKey)) {
    return Response.json({ error: "Invalid license key format" }, { status: 400 });
  }

  const licenses = getStore("licenses");
  const licenseData = await licenses.get(normalizedKey, { type: "json" });

  if (!licenseData) {
    return Response.json(
      { error: "License key not found", code: "KEY_NOT_FOUND" },
      { status: 404 }
    );
  }

  // Not yet activated — activate now
  if (!licenseData.activated) {
    licenseData.machineId = machineId;
    licenseData.activated = true;
    licenseData.activatedAt = new Date().toISOString();
    await licenses.setJSON(normalizedKey, licenseData);

    return Response.json({
      success: true,
      message: "License activated successfully",
      email: licenseData.email,
    });
  }

  // Already activated, same machine — re-activation OK
  if (licenseData.machineId === machineId) {
    return Response.json({
      success: true,
      message: "License already activated on this machine",
      email: licenseData.email,
      reactivation: true,
    });
  }

  // Already activated, different machine — rejected
  return Response.json(
    {
      error: "License already activated on a different machine",
      code: "MACHINE_MISMATCH",
      hint: "Contact support at jnicometo@gritsoftware.dev for assistance",
    },
    { status: 403 }
  );
};

export const config = {
  path: "/api/activate-license",
};
