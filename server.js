import express from "express";
import dotenv from "dotenv";
import requireInternalAuth from "./lib/auth.js";

import payments from "./routes/payments.js";
import members from "./routes/members.js";
import policy from "./routes/policy.js";

dotenv.config();

const app = express();
app.use(express.json()); // <-- parse JSON bodies

// public health
app.get("/retell/health", (req, res) => res.json({ ok: true }));

// (optional) root ping
app.get("/", (req, res) => res.json({ ok: true }));

// protect only the Retell tool namespace
app.use("/retell/tools", requireInternalAuth);

// Retell tool routes
app.use("/retell/tools", payments);
app.use("/retell/tools", members);
app.use("/retell/tools", policy);

// TODO: when vendor gives write endpoints, add routes here:
// - /update_member
// - /add_dependent
// - /process_payment
// etc.

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`retell-backend listening ${port}`));
