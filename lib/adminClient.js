// --- helpers already in file ---
// const ADMIN_BASE = process.env.ADMIN_BASE || "https://api.1administration.com/v1";
// const ADMIN_USER = process.env.ADMIN_USER || "";
// const ADMIN_PASS = process.env.ADMIN_PASS || "";
// const ADMIN_AGENT_ID = process.env.ADMIN_AGENT_ID || "";
// function basicAuth() { ... }

// GET /{agent_id}/signatureexists/{member_id}/{product_id}/{policy_number}.json
export async function getSignatureExists({
  member_id,
  product_id = 0,
  policy_number = "0"
}) {
  if (!member_id) throw new Error("member_id required");

  const url = `${ADMIN_BASE}/${ADMIN_AGENT_ID}/signatureexists/${member_id}/${product_id || 0}/${policy_number || "0"}.json`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": basicAuth(),
      "Accept": "application/json",
    },
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Status API error (${res.status}): ${txt}`);
  }

  const json = await res.json();
  // normalize a bit
  return {
    exists: !!json?.signatureexists?.exists,
    member_id: json?.signatureexists?.memberid || member_id,
    raw: json
  };
}

// GET /{agent_id}/transactionstatus/{member_id}/{product_id}/{policy_number}/{payment_number}.json
export async function getTransactionStatus({
  member_id,
  product_id = 0,
  policy_number = "0",
  payment_number = 0
}) {
  if (!member_id) throw new Error("member_id required");

  const url = `${ADMIN_BASE}/${ADMIN_AGENT_ID}/transactionstatus/${member_id}/${product_id || 0}/${policy_number || "0"}/${payment_number || 0}.json`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": basicAuth(),
      "Accept": "application/json",
    },
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Status API error (${res.status}): ${txt}`);
  }

  const json = await res.json();
  return {
    status: json?.transactionstatus?.status || null,
    payment_number: json?.transactionstatus?.paymentnumber ?? null,
    member_id: json?.transactionstatus?.memberid || member_id,
    raw: json
  };
}
