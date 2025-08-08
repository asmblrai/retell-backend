// routes/policy.js
import Router from "express";
const r = Router();

// POST /retell/tools/get_signature_status
r.post("/get_signature_status", async (req, res) => {
  const { member_id } = req.body || {};
  if (!member_id) return res.status(400).json({ success: false, error: "MISSING_MEMBER_ID" });

  // We no longer call the Status API. Return a safe default for now.
  return res.json({
    success: true,
    signature: {
      exists: 0,       // 0 = no doc found (until we wire a real check)
      a: null,         // UUID (would be returned if a doc existed)
      memberid: member_id,
    },
  });
});

export default r;
