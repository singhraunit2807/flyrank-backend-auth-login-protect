# Swagger screenshot evidence

The assignment requires a screenshot of the working Swagger UI in the README.

After configuring a real Supabase project and starting the API:

1. Open `http://localhost:3000/docs`.
2. Confirm the lock icon appears on `/auth/logout`, `/protected/profile`, `/protected/dashboard`, and `/protected/admin`.
3. Click **Authorize** and paste a valid Supabase access token.
4. Run `GET /protected/profile` with **Try it out** and confirm `200`.
5. Change one token character and confirm the protected request returns `401`.
6. Save a screenshot as `docs/swagger-ui.png`.
7. Add the image to the README with `![Swagger UI](docs/swagger-ui.png)`.

This file intentionally does not fake a screenshot: the evidence should be captured from the locally running API with the user's real Supabase project.
