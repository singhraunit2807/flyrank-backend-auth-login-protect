# AI rematch — quarantine implementation

This folder is intentionally separate from the hand-built submission. It represents the AI-generated variant requested by Stage 7.

## Prompt used

> Build a Node.js 22 + Express secure authentication API using Supabase Auth as the Identity Provider. Implement POST /auth/signup (201), POST /auth/login (200 with access and refresh tokens), POST /auth/logout (204), GET /protected/profile (200), and GET /public/info (200). Missing input must return 400; missing, malformed, invalid, or expired bearer tokens must return 401. Extract Authorization: Bearer <token>, verify the JWT with Supabase getUser(token), and implement reusable auth middleware. Do not store or hash passwords and never use or expose the service_role key. Add Swagger UI at /docs with an HTTP bearer JWT security scheme and mark protected routes as secured. Keep the AI implementation isolated from the hand-built submission.

## AI-generated file

`server.js` contains a deliberately compact single-file implementation of the requested core API.

## AI vs me — concrete differences

1. **Bearer parsing:** the AI variant uses a simple `authorization.split(' ')[1]` extraction. The hand-built version explicitly matches `^Bearer\\s+(.+)$` and therefore rejects an arbitrary authorization scheme instead of silently accepting its second token.
2. **Separation of concerns:** the AI variant puts routes, middleware, configuration and Swagger setup in one file. The hand-built version separates `config.js`, `supabase.js`, `middleware/auth.js`, route modules and `openapi.json`, making the guard reusable and reviewable.
3. **Security hardening:** the hand-built version adds `x-powered-by` removal, login rate limiting, refresh-token rotation flow, a 403 admin authorization example, safe profile fields, and a dedicated `.env`/`.env.example` policy. The AI core version does not include those stretch protections because they were not in the initial prompt.
4. **Token trust:** both versions call `getUser(token)`, but the hand-built middleware explicitly requires both a successful call and a non-null user before attaching `req.user`.
5. **Swagger scope:** the hand-built OpenAPI file marks every protected route with the same reusable `bearerAuth` security scheme and documents 401/403/429 cases; the AI variant documents only the core required endpoints.

## Security review

- Token must not be logged.
- `service_role` must never be used in this backend.
- `getUser(token)` must be checked for an error before the route trusts the user.
- Authorization must use the `Bearer` scheme, not merely take the second whitespace-separated value.
- A tampered token must reach Supabase verification and produce 401.

## Rematch improvement

The improved prompt adds explicit requirements for strict Bearer parsing, `req.user` attachment only after successful verification, no token logging, no `service_role`, JSON error responses, and a valid-token/tampered-token test matrix. The hand-built implementation already satisfies those strengthened requirements.
