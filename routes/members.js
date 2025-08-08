// routes/members.js
import { Router } from "express";
import { getLead, getLeadPolicies, getLeadDependents } from "../lib/tldClient.js";
import { normalizeDependents, normalizeProducts } from "../lib/normalizers.js";

const r = Router();

/**
 * POST /retell/tools/get_member_snapshot
 * body: { member_id }  // for TLD we treat member_id as TLD lead_id
 */
r.post("/get_member_snapshot", async (req, res) => {
  try {
    const { member_id } = req.body || {};
    if (!member_id) {
      return res.status(400).json({ success: false, error: "MISSING_MEMBER_ID" });
    }

    // Pull from TLD egress
    const [leadResp, depsResp, polResp] = await Promise.all([
      getLead(member_id),
      getLeadDependents(member_id),
      getLeadPolicies(member_id),
    ]);

    // These shapes depend on the tenant. Try to find the first/only item.
    const lead = Array.isArray(leadResp) ? leadResp[0] : (leadResp?.data?.[0] ?? leadResp?.data ?? leadResp);

    const dependentsRaw = Array.isArray(depsResp) ? depsResp : (depsResp?.data ?? []);
    const productsRaw = Array.isArray(polResp) ? polResp : (polResp?.data ?? []);

    const dependents = normalizeDependents(dependentsRaw);
    const products = normalizeProducts(productsRaw);

    return res.json({
      success: true,
      member: {
        member_id: lead?.id ?? lead?.member_id ?? null,
        first_name: lead?.first_name ?? lead?.firstname ?? null,
        last_name: lead?.last_name ?? lead?.lastname ?? null,
        email: lead?.email ?? lead?.email1 ?? null,
        phone: lead?.phone ?? lead?.phone1 ?? null,
        address: lead?.address ?? lead?.address1 ?? null,
        city: lead?.city ?? null,
        state: lead?.state ?? null,
        zip: lead?.zip ?? lead?.zipcode ?? null,
      },
      dependents,
      products,
    });
  } catch (e) {
    res.status(500).json({ success: false, error: "UPSTREAM_ERROR", detail: String(e).slice(0, 300) });
  }
});

export default r;

