// Protects routes that expose private data (like contact form submissions).
// The frontend admin page must send the correct key in the "x-admin-key" header.
// Set ADMIN_KEY as an environment variable, both locally and on Render — pick a long random string.
export function requireAdminKey(req, res, next) {
  const key = req.headers["x-admin-key"];
  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}