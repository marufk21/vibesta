/**
 * Shared cookie options for the auth token.
 *
 * The auth cookie is an HttpOnly JWT.  In cross-origin production deployments
 * (frontend on Vercel, backend on Render) `SameSite=None` + `Secure` is
 * required so the browser transmits the cookie on cross-site HTTPS requests.
 *
 * In local development (same-site, HTTP) `SameSite=strict` / `Secure=false`
 * works fine and is safer.
 *
 * Override at any time via the COOKIE_SAMESITE and COOKIE_SECURE env vars.
 */
export const getCookieOptions = () => ({
  httpOnly: true,
  sameSite: process.env.COOKIE_SAMESITE || 'strict',
  secure: process.env.COOKIE_SECURE === 'true' || false,
  maxAge: 1 * 24 * 60 * 60 * 1000, // 24h
});
