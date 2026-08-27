# AI rematch review

## Comparison matrix

| Area | AI quarantine version | Hand-built submission |
|---|---|---|
| Bearer extraction | Splits the header and takes the second token | Requires the explicit `Bearer` scheme with a strict pattern |
| Structure | Single server file | Config, Supabase client, middleware, routes, Swagger and server separated |
| Protected routes | Core profile/logout only | Profile, dashboard and admin reuse the same middleware |
| Authorization | Authentication only | Adds a real 403 admin authorization example |
| Login protection | No login limiter in the initial AI prompt | 5 failed attempts / 15 minutes with 429 |
| Token lifecycle | Core access/refresh login output | Adds explicit refresh endpoint |
| OpenAPI | Core routes | Bearer security on all protected routes plus stretch error cases |

## Security findings

- A token parser should not accept `Authorization: Basic <token>` or another scheme merely because a second whitespace-separated value exists.
- `getUser(token)` must be checked for both an error and a missing user before the request is trusted.
- Tokens and passwords must never be logged.
- A service-role key would bypass normal security boundaries and therefore must never be committed or used in this public assignment repository.

## What the first prompt forgot

The first prompt specified the core assignment but did not explicitly require strict Bearer parsing, a 403 example, refresh-token exchange, login rate limiting, or the stretch security checklist. Those were made explicit in the improved prompt.

## Rematch outcome

The improved prompt is more precise about token extraction, verification, secret handling and testing. The hand-built implementation already follows those strengthened requirements.
