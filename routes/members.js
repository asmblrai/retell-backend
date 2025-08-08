import { Router } from "express";
import { userGetAll } from "../lib/searchClient.js";
import { normalizeDependents, normalizeProducts } from "../lib/normalizers.js";

const r = Router();

// POST /retell/tools/get_member_snapshot { member_id }
r.post("/get_member_snapshot", async (req, res) => {
  try {
    const { member_id } = req.body || {};
    if (!member_id) return res.status(400).json({ success:false, error:"MISSING_MEMBER_ID" });

    const data = await userGetAll({ memberId: member_id, returnDependents: 1, returnProducts: 1, returnTransactions: 0 });

    const user = (data.users && data.users[0]) || {};
    const dependents = normalizeDependents(data.dependents);
    const products = normalizeProducts(data.products);

    return res.json({
      success: true,
      member: {
        member_id: user.memberid || null,
        first_name: user.firstname || null,
        last_name: user.lastname || null,
        email: user.email || null,
        phone: user.phone1 || null,
        address: user.address || null,
        city: user.city || null,
        state: user.state || null,
        zip: user.zip || null
      },
      dependents,
      products
    });
  } catch (e) {
    res.status(502).json({ success:false, error:"UPSTREAM_ERROR", detail:String(e).slice(0,300) });
  }
});

export default r;
