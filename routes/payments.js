// routes/payments.js
import { Router } from "express";
const router = Router();

/**
 * POST /retell/tools/get_payment_method
 * For now, TLD egress may not expose a payment profile.
 * Return null but keep the shape so Retell doesn't break.
 */
router.post("/get_payment_method", async (req, res) => {
  try {
    const { member_id } = req.body || {};
    if (!member_id) return res.status(400).json({ error: "member_id required" });

    return res.json({
      success: true,
      payment_method: null,
      raw: null,
      note: "No payment method endpoint yet; using TLD egress read-only data.",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
