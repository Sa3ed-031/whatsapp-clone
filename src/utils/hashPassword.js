// NOTE: This is a demo app without a real backend. All data lives in the
// browser's Local Storage, so passwords are never stored in plain text: we
// keep a SHA-256 hash instead and compare hashes on login. A real app would
// hash passwords on a server with a slow, salted algorithm (bcrypt/argon2).
export async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
