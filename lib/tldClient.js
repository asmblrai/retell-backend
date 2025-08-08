// lib/tldClient.js
import fetch from "node-fetch";

const TLD_BASE = process.env.TLD_BASE || "https://api.tldcrm.info";
const TLD_API_ID = process.env.TLD_API_ID || "";
const TLD_API_KEY = process.env.TLD_API_KEY || "";

/**
 * Small helper to build URLs with query params
 */
function buildUrl(path, params = {}) {
  const url = new URL(path.replace(/\/+$/, ""), TLD_BASE);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  });
  return url.toString();
}

function authHeaders() {
  if (!TLD_API_ID || !TLD_API_KEY) {
    throw new Error("Missing TLD_API_ID/TLD_API_KEY env vars");
  }
  // Most TLD integrations use these header names; if your vendor specifies different ones, tweak here.
  return {
    "X-TLDCRM-API-ID": TLD_API_ID,
    "X-TLDCRM-API-KEY": TLD_API_KEY,
    "Accept": "application/json",
  };
}

async function tldGet(path, params = {}) {
  const url = buildUrl(path, params);
  const res = await fetch(url, { headers: authHeaders() });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`TLD ${path} ${res.status}: ${text.slice(0, 500)}`);
  }
  return res.json();
}

/**
 * Egress endpoints we’ll use (read-only):
 *  - /api/egress/leads
 *  - /api/egress/lead_policies
 *  - /api/egress/lead_dependents
 *  - /api/egress/lead_notes
 *
 * NOTE: Param names vary by tenant. We’ll start with `lead_id`. If your vendor tells us to use a different param,
 * update the { lead_id } key below accordingly.
 */

export async function getLead(lead_id) {
  if (!lead_id) throw new Error("lead_id required");
  return tldGet("/api/egress/leads", { lead_id });
}

export async function getLeadPolicies(lead_id) {
  if (!lead_id) throw new Error("lead_id required");
  return tldGet("/api/egress/lead_policies", { lead_id });
}

export async function getLeadDependents(lead_id) {
  if (!lead_id) throw new Error("lead_id required");
  return tldGet("/api/egress/lead_dependents", { lead_id });
}

export async function getLeadNotes(lead_id) {
  if (!lead_id) throw new Error("lead_id required");
  return tldGet("/api/egress/lead_notes", { lead_id });
}
