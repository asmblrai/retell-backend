import { Router } from "express";
import { getPaymentMethod, getTransactionStatus } from "../lib/adminClient.js";
import { normalizePayment } from "../lib/normalizers.js";

const r = Router();

// POST /retell/tools/get_payment_method { member_id }
r.post("/get_payment_method", async (req, res) => {
  try {
    const { member_id } = req.body || {};
    if (!member_id) return res.status(400).json({ success:false, error:"MISSING_MEMBER_ID" });

    const raw = await getPaymentMethod(member_id);
    if (!raw) return res.json({ success:false, error:"PAYMENT_METHOD_NOT_FOUND" });

    return res.json({ success:true, payment_method: normalizePayment(raw) });
  } catch (e) {
    res.status(502).json({ success:false, error:"UPSTREAM_ERROR", detail:String(e).slice(0,300) });
  }
});

// POST /retell/tools/get_transaction_status { member_id, product_id?, policy_number?, payment_number? }
r.post("/get_transaction_status", async (req, res) => {
  try {
    const { member_id, product_id=0, policy_number=0, payment_number=0 } = req.body || {};
    if (!member_id) return res.status(400).json({ success:false, error:"MISSING_MEMBER_ID" });

    const ts = await getTransactionStatus({
      memberId: member_id,
      productId: product_id || 0,
      policyNumber: policy_number || 0,
      paymentNumber: payment_number || 0
    });
    if (!ts) return res.json({ success:false, error:"TX_NOT_FOUND" });

    return res.json({ success:true, transaction_status: ts });
  } catch (e) {
    res.status(502).json({ success:false, error:"UPSTREAM_ERROR", detail:String(e).slice(0,300) });
  }
});

export default r;
