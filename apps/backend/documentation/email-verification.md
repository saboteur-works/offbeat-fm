# Email Verification

## Overview

New users are created with `accountStatus: "pending"` and cannot log in until they verify their email address. Verification is handled via a time-limited, single-use token sent by [Resend](https://resend.com).

## Flow

1. **Sign up** — `POST /api/v1/auth/sign-up`
   - User document created with `accountStatus: "pending"`
   - A 32-byte random token is generated; its SHA-256 hash and a 24-hour expiry are stored on the user document
   - The raw token is embedded in a verification URL and emailed to the user
   - The raw token is never persisted — only the hash is stored

2. **Verify** — `GET /api/v1/auth/verify-email/:token`
   - The raw token from the URL is hashed and matched against the stored hash
   - If valid and not expired, `accountStatus` is set to `"active"` and the token fields are cleared
   - Returns 400 for invalid or expired tokens

3. **Resend** — `POST /api/v1/auth/resend-verification`
   - Accepts `{ email }` in the request body
   - If an unverified account exists for that email, a new token is generated and a fresh email is sent
   - Always returns 200 regardless of whether the email exists (prevents enumeration)

4. **Login blocked** — the existing `checkUserAccountStatus` middleware rejects any user whose `accountStatus` is not `"active"`, so pending users cannot log in

## Configuration

| Secret / Var | Type | Required | Notes |
|---|---|---|---|
| `RESEND_API_KEY` | Docker secret | All envs | Get from [resend.com/api-keys](https://resend.com/api-keys); place in `./secrets/RESEND_API_KEY.txt` |
| `EMAIL_FROM` | Env var | Optional | Defaults to `onboarding@resend.dev`; set to a verified domain address in production |
| `CLIENT_URL` | Env var | Required | Used to build the verification link — already set in `compose.yml` for dev |

## Token implementation

- **Generation**: `crypto.randomBytes(32).toString("hex")` (Node.js built-in, no extra dependency)
- **Storage**: SHA-256 hash of the raw token stored in `User.emailVerificationToken`; expiry in `User.emailVerificationExpiry`
- **Verification**: incoming token is hashed and compared; raw token never touches the database
- **Cleanup**: both fields are `$unset` when the token is consumed

## Manually activating a user (admin)

An admin can activate any user via:

```
PATCH /api/v1/admin/users/:userId/status
{ "accountStatus": "active" }
```

---

## Follow-up steps (future work)

- **Stale account cleanup** — add a scheduled job (or MongoDB TTL index on `emailVerificationExpiry`) to delete `"pending"` users whose tokens expired more than 7 days ago. This prevents unbounded growth of unverified accounts.

- **Dedicated rate limit on resend endpoint** — the current global rate limiter (30 req/10s per IP) provides basic protection, but `POST /auth/resend-verification` should have its own stricter limit (e.g. 3 requests per 10 minutes per IP) to prevent email flooding abuse. Use `express-rate-limit` with a separate store key.

- **Production `EMAIL_FROM` address** — set `EMAIL_FROM` to a verified sending domain in `compose.prod.yml` (e.g. `noreply@yourdomain.com`). Verify the domain in the Resend dashboard first.

- **Bounce and complaint monitoring** — track delivery health via the Resend dashboard or webhook events. High bounce rates will get the account flagged by Resend.

- **Admin resend UI** — add a button in the admin users panel to trigger `POST /auth/resend-verification` on behalf of a user (useful for support cases).

- **Domain allowlisting for artist signups** — consider restricting which email domains can register artist accounts, if the artist onboarding flow becomes invite-only.
