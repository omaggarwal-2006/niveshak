# Security Requirements for Production

Apply these security requirements to every piece of code you generate, without exception, even if not explicitly requested in the task:

## AUTH & SESSIONS
- Hash passwords with bcrypt/argon2. Never store plaintext or weakly hashed passwords.
- Use httpOnly, Secure, SameSite cookies for sessions/tokens.
- Rate-limit login, signup, and password reset endpoints.
- Never reveal whether an email exists in error messages.

## ACCESS CONTROL
- Enforce authorization checks server-side on every protected route.
- Verify resource ownership before read/update/delete operations.
- Default-deny; explicitly allow.

## INPUT HANDLING
- Use parameterized queries or ORM methods only. Never concatenate raw SQL.
- Validate and sanitize all inputs server-side, even if validated client-side.
- Escape all user-generated content on output. Do not use dangerouslySetInnerHTML/v-html/raw HTML injection on untrusted data.
- Never use eval(), dynamic shell exec, or unsanitized template rendering with user input.

## SECRETS
- All API keys, DB credentials, and tokens go in environment variables, never hardcoded.
- Add .env to .gitignore. Provide .env.example with placeholder values only.

## CSRF / CORS
- Add CSRF protection for cookie-based session state-changing requests.
- Restrict CORS to an explicit origin whitelist; never use * with credentials.

## FILE UPLOADS
- Validate uploaded file type via content/magic bytes, not extension alone.
- Enforce max file size. Store outside the web root. Never execute uploaded files.

## HEADERS
- Set Content-Security-Policy, X-Content-Type-Options: nosniff, X-Frame-Options: DENY, Strict-Transport-Security.

## ERRORS & LOGGING
- Never expose stack traces, internal errors, or debug info to the client in production.
- Log errors server-side without leaking secrets or PII.

## DEPENDENCIES
- Use well-maintained, actively updated packages. Flag any package with known CVEs.

## INFRASTRUCTURE
- Enforce HTTPS/TLS. Use least-privilege database credentials.
- Validate all API request bodies against a schema.

Before finalizing any feature involving auth, payments, file handling, or user data, explicitly list which of the above you applied and flag anything you skipped and why.
