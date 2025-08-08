import express from "express";
import dotenv from "dotenv";
import { requireInternalAuth } from "./lib/auth.js";
import payments from "./routes/payments.js";
import members from "./routes/members.js";
import policy from "./routes/policy.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(requireInternalAuth);

// health
app.get("/", (_req, res) => res.json({ ok: true }));

// namespace for Retell tools
app.use("/retell/tools", payments);
app.use("/retell/tools", members);
app.use("/retell/tools", policy);

// TODO: when vendor gives write endpoints, add routes here:
// - /update_member
// - /add_dependent
// - /update_dependent
// - /process_payment
// - /update_recurring_date
// - /cancel_policy
// - /upgrade_policy
// - /resend_email
// - /reset_fulfillment
// - /log_consent
// - /verify_customer
// - /authorize_payment_method
// - /verify_disclosures_and_legal

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`retell-backend listening :${port}`));
