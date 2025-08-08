// routes/payments.js
import { Router } from "express";
import { fetchPaymentMethod } from "../lib/adminClient.js";

const router = Router();

// POST /retell/tools/get_payment_method
router.post("/get_payment_method", async (req, res) => {
  try {
    const { member_id } = req.body || {};
    if (!member_id) return res.status(400).json({ error: "member_id required" });

    const data = await fetchPaymentMethod(member_id);

    // normalize payload for Retell function
    res.json({
      success: true,
      payment_method: data?.paymentmethod || null,
      raw: data,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
