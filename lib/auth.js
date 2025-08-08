export function requireInternalAuth(req, res, next) {
  const needed = process.env.INTERNAL_TOKEN;
  if (!needed) return next(); // dev mode
  const ok = req.headers.authorization === `Bearer ${needed}`;
  if (!ok) return res.status(401).json({ success: false, error: "UNAUTHORIZED" });
  next();
}
