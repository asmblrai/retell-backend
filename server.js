import express from "express";
import dotenv from "dotenv";
import { requireInternalAuth } from "./lib/auth.js"; // <-- changed to named import
import payments from "./routes/payments.js";
import members from "./routes/members.js";
import policy from "./routes/policy.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(requireInternalAuth);

// Health
app.get("/", (_, res) => res.json({ ok: true }));

// namespace for Retell tools
app.use("/retell/tools", payments);
app.use("/retell/tools", members);
app.use("/retell/tools", policy);

// TODO: when vendor gives write endpoints, add routes here:

// simple health endpoint for uptime checks
app.get("/retell/health", (req, res) => {
  res.json({ ok: true });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`retell-backend listening ${port}`));
