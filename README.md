# FlyRank Backend Track — A4 Auth · Login & Protect

Secure Express API using Supabase Auth, JWT bearer-token verification, reusable authentication middleware, Swagger UI, refresh tokens, 403 authorization, and login rate limiting.

## Assignment coverage

This repository follows FlyRank Internship Backend Track Week 2 Assignment A4 in stage order:

- Stage 0 — Supabase client, environment configuration, server startup
- Stage 1 — Sign up and log in
- Stage 2 — Public route and protected route
- Stage 3 — Real JWT verification with Supabase `getUser(token)`
- Stage 4 — Reusable auth middleware, protected dashboard, logout
- Stage 5 — Swagger UI with Bearer/JWT authorization
- Stage 6 — GitHub publication, security checks, README and manual test flow
- Stage 7 — AI rematch and code-review comparison

Stretch items are also implemented: 403 admin authorization, refresh-token exchange, and login brute-force rate limiting.

## Security model

Supabase Auth is the Identity Provider. This API does not store passwords and does not implement password hashing or JWT cryptography itself. Supabase issues the access and refresh tokens; the backend extracts the bearer token and verifies it with Supabase before protected handlers run.

The repository must never contain a real `.env` file or a `service_role` key.

## Tech stack

- Node.js 22+
- Express 5
- `@supabase/supabase-js`
- `dotenv`
- `swagger-ui-express`
- `express-rate-limit`

## Project structure

```text
.
├── .env.example
├── .gitignore
├── openapi.json
├── package.json
├── src/
│   ├── app.js
│   ├── config.js
│   ├── server.js
│   ├── supabase.js
│   ├── swagger.js
│   ├── middleware/
│   │   └── auth.js
│   └── routes/
│       ├── auth.js
│       ├── public.js
│       └── protected.js
├── ai-version/
│   └── README.md
└── docs/
    └── SWAGGER_SCREENSHOT_REQUIRED.md
```

## 1. Supabase setup

1. Create a free Supabase project.
2. Open the project API settings and copy the Project URL and the public anon/publishable key.
3. Do **not** use or expose the `service_role` key.
4. For this practice assignment, disable **Confirm Email** under the Email provider settings so a newly created test user can log in immediately. In production, keep email confirmation enabled.

## 2. Local environment

Copy `.env.example` to `.env` and replace the placeholders:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=your-anon-or-publishable-key
PORT=3000
```

The `.env` file is ignored by Git.

## 3. Install and run

```bash
npm install
npm start
```

The API runs at `http://localhost:3000`.

Swagger UI: `http://localhost:3000/docs`

OpenAPI JSON: `http://localhost:3000/openapi.json`

## 4. API reference

| Method | Endpoint | Auth | Success | Main errors |
|---|---|---|---|---|
| POST | `/auth/signup` | No | 201 | 400 |
| POST | `/auth/login` | No | 200 | 400, 401, 429 |
| POST | `/auth/refresh` | No | 200 | 400, 401 |
| POST | `/auth/logout` | Bearer JWT | 204 | 401 |
| GET | `/protected/profile` | Bearer JWT | 200 | 401 |
| GET | `/protected/dashboard` | Bearer JWT | 200 | 401 |
| GET | `/protected/admin` | Bearer JWT + admin role | 200 | 401, 403 |
| GET | `/public/info` | No | 200 | — |

## 5. Required authentication flow

### Sign up

```bash
curl -i -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Expected status: `201 Created`.

### Log in

```bash
curl -i -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Expected status: `200 OK` with `access_token` and `refresh_token`.

### Public route

```bash
curl -i http://localhost:3000/public/info
```

Expected status: `200 OK`.

### Protected route without token

```bash
curl -i http://localhost:3000/protected/profile
```

Expected status: `401 Unauthorized` with `Access token required`.

### Protected route with a valid token

```bash
curl -i http://localhost:3000/protected/profile \
  -H "Authorization: Bearer PASTE_ACCESS_TOKEN_HERE"
```

Expected status: `200 OK` with safe user metadata: id, email and account-created date.

### Tampered token test

Change one character in the access token and call the same endpoint again.

Expected status: `401 Unauthorized` with `Invalid or expired token`.

### Dashboard reuse test

```bash
curl -i http://localhost:3000/protected/dashboard \
  -H "Authorization: Bearer PASTE_ACCESS_TOKEN_HERE"
```

The same reusable middleware protects this route; no new token-verification code is copied into the handler.

### Logout

```bash
curl -i -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer PASTE_ACCESS_TOKEN_HERE"
```

Expected status: `204 No Content`.

Note: Supabase access JWTs remain valid until expiry even after server-side sign-out; logout revokes the refresh-token session. This is why short access-token lifetimes matter.

## 6. Stretch requirements

### 403 authorization case

`GET /protected/admin` first authenticates the caller with the same middleware. It then checks `user.app_metadata.role`.

- Missing/invalid token → `401 Unauthorized`
- Valid authenticated user without `admin` role → `403 Forbidden`
- Valid authenticated user with `admin` role → `200 OK`

The distinction is intentional: 401 means the API cannot authenticate the caller; 403 means the caller is authenticated but is not allowed to perform the operation.

### Refresh-token endpoint

```bash
curl -i -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token":"PASTE_REFRESH_TOKEN_HERE"}'
```

A successful refresh returns a fresh access token and refresh token. Access tokens are short-lived, while refresh tokens are used to obtain a new access token without asking the user to log in again.

### Login rate limiting

`POST /auth/login` allows up to 5 failed attempts per IP within 15 minutes. Successful logins are not counted toward the failed-attempt limit. Further failures return `429 Too Many Requests`.

## 7. Swagger UI

Swagger is served at `/docs`. Protected routes declare the `bearerAuth` security scheme, so Swagger displays the **Authorize** padlock. Paste the Supabase access token into Authorize and use **Try it out** on `/protected/profile` or `/protected/dashboard`.

A final browser screenshot of the working Swagger UI is required as submission evidence and should be saved as `docs/swagger-ui.png` after the local Supabase-backed test succeeds. See `docs/SWAGGER_SCREENSHOT_REQUIRED.md`.

## 8. Git and submission checks

Before submission:

```bash
git status
git log --oneline
git grep -n "service_role" -- ':!docs/*'
```

Confirm:

- `.env` is ignored and is not committed.
- No real Supabase key appears in tracked files or Git history.
- `.env.example` contains placeholders only.
- `git log` shows the stage commits.
- The full flow works with curl.
- The full flow works with Swagger Authorize + Try it out.
- The tampered token returns 401.
- A second protected route uses the same middleware.
- The README includes the Swagger screenshot.

## 9. Stage commits

The repository history is intentionally organized by the assignment stages:

1. `Stage 0: setup server and supabase client`
2. `Stage 1: signup and login routes working`
3. `Stage 2: public route and unverified protected route`
4. `Stage 3: profile route token verification`
5. `Stage 4: auth middleware and logout endpoint`
6. `Stage 5: Swagger UI documentation with bearer auth`
7. `Stage 6: publish to GitHub and write README`
8. `Stage 7: AI vs me`

The extra initialization commit precedes Stage 0.

## 10. AI vs me

The AI rematch is kept in `ai-version/` so the hand-built submission remains untouched. The section documents the prompt, the comparison, security findings, and the improved prompt as required by the assignment.

### Initial AI prompt

> Build a Node.js 22 + Express secure authentication API using Supabase Auth as the Identity Provider. Implement POST /auth/signup (201), POST /auth/login (200 with access and refresh tokens), POST /auth/logout (204), GET /protected/profile (200), and GET /public/info (200). Missing input must return 400; missing, malformed, invalid, or expired bearer tokens must return 401. Extract Authorization: Bearer <token>, verify the JWT with Supabase getUser(token), and implement reusable auth middleware. Do not store or hash passwords and never use or expose the service_role key. Add Swagger UI at /docs with an HTTP bearer JWT security scheme and mark protected routes as secured. Keep the AI implementation isolated from the hand-built submission.

### Review checklist

1. Token extraction must require the `Bearer` scheme and reject malformed authorization headers.
2. Token verification must check the `getUser(token)` result and the error before trusting the user.
3. Secrets must come from `.env`; the service_role key must never appear in source or logs.
4. The AI version must be tested with a valid token and a tampered token.
5. The AI output must be compared with the hand-built version and the prompt improved after the review.

See `ai-version/README.md` for the quarantine implementation and concrete differences.

## Status code summary

- `200 OK` — successful login, reads, refresh, and authorized admin access
- `201 Created` — successful signup
- `204 No Content` — successful logout
- `400 Bad Request` — missing required input
- `401 Unauthorized` — missing/malformed/invalid/expired authentication
- `403 Forbidden` — authenticated but not authorized
- `429 Too Many Requests` — login rate limit exceeded

## Official references

- Supabase Auth: https://supabase.com/docs/guides/auth
- Supabase JavaScript `signUp`: https://supabase.com/docs/reference/javascript/auth-signup
- Supabase JavaScript `signInWithPassword`: https://supabase.com/docs/reference/javascript/auth-signinwithpassword
- Supabase JavaScript `getUser`: https://supabase.com/docs/reference/javascript/auth-getuser
- Supabase JavaScript `refreshSession`: https://supabase.com/docs/reference/javascript/auth-refreshsession
- Supabase JavaScript `signOut`: https://supabase.com/docs/reference/javascript/auth-signout
- Swagger UI Express: https://www.npmjs.com/package/swagger-ui-express
