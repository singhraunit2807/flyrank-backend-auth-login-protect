# Improved AI rematch prompt

Build the same Node.js 22 + Express API using Supabase Auth, but follow these additional requirements exactly:

- Implement POST /auth/signup, POST /auth/login, POST /auth/logout, GET /protected/profile and GET /public/info.
- Return 201 on successful signup, 200 on successful login/read, 204 on successful logout, 400 for missing required input, and 401 for missing, malformed, invalid, or expired authentication.
- Extract the token only from `Authorization: Bearer <token>`; reject any other scheme or malformed header.
- Verify the exact supplied JWT with `supabase.auth.getUser(token)` and only trust the user when both `error` is absent and `data.user` exists.
- Use reusable authentication middleware/dependency and attach only the verified user and token needed by downstream handlers.
- Never log, persist, or return passwords or access tokens except where the login response explicitly returns the access token required by the API contract.
- Never use the Supabase `service_role` key; use environment variables and keep `.env` ignored.
- Add Swagger UI with an HTTP bearer JWT security scheme and secure all protected routes in the OpenAPI document.
- Keep the generated implementation in an isolated `ai-version/` folder or branch.
- Test the generated implementation with a valid access token and with a one-character-tampered token; the first must succeed and the second must return 401.
- Explain at least three concrete differences between the generated code and the hand-built implementation.

The goal is not only to generate code but to make the security contract explicit enough that unsafe shortcuts are rejected.
