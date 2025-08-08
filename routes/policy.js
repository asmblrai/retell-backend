import { Router } from "express";
import { getSignatureExists } from "../lib/adminClient.js";

const r = Router();

// POST /retell/tools/get_signature_status { member_id, product_id?, policy_number? }
r.post("/get_signature_status", async (req, res) => {
  try {
    const { member_id, product_id=0, policy_number=0 } = req.body || {};
    if (!member_id) return res.status(400).json({ success:false, error:"MISSING_MEMBER_ID" });

    const sig = await getSignatureExists({ memberId: member_id, productId: product_id || 0, policyNumber: policy_number || 0 });
    if (!sig) return res.json({ success:false, error:"SIGNATURE_NOT_FOUND" });

    // sig.exists: 1/0, "a": UUID if not exists (per doc), memberid
    return res.json({ success:true, signature: sig });
  } catch (e) {
    res.status(502).json({ success:false, error:"UPSTREAM_ERROR", detail:String(e).slice(0,300) });
  }
});

export default r;
