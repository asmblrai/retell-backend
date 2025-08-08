// lib/adminClient.js
import fetch from "node-fetch";

const ADMIN_BASE = process.env.ADMIN_BASE || "https://api.1administration.com/v1";
const ADMIN_USER = process.env.ADMIN_USER || process.env.SEARCH_USERNAME || "";
const ADMIN_PASS = process.env.ADMIN_PASS || process.env.SEARCH_PASSWORD || "";
const ADMIN_AGENT_ID = process.env.ADMIN_AGENT_ID || "";

function basicAuth() {
  // Render uses ESM; btoa isn't global on Node, so do Buffer:
  const raw = `${ADMIN_USER}:${ADMIN_PASS}`;
  const token = Buffer.from(raw).toString("base64");
  return `Basic ${token}`;
}

/**
 * Minimal wrapper for the Status API: /paymentmethod/{member_id}.json
 */
export async function fetchPaymentMethod(memberId) {
  if (!memberId) throw new Error("member_id required");
  const url = `${ADMIN_BASE}/${ADMIN_AGENT_ID}/paymentmethod/${memberId}.json`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": basicAuth(),
      "Accept": "application/json",
    },
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Status API error ${res.status}: ${txt}`);
  }
  return res.json();
}

// You can add other wrappers here later (transactionstatus, signatureexists, etc.)
