# Adigun Control

Private source repository for admin.hephzibahbehulah.com.

Build the Admin assets with `node platform/build.mjs` and run the local checks with `node --test platform/*.test.mjs`. Workers.dev and version preview URLs are disabled for both environments.

Run \`node platform/admin-deployment.mjs preview\` or \`node platform/admin-deployment.mjs production\` to generate an unrouted Wrangler configuration. Each Worker has its own Sandbox. Add the \`route\` argument to generate a configuration that attaches that environment’s Admin hostname. Verify Cloudflare Access protection and the required Worker secrets before deploying the routed configuration.

Public marketing pages and individual product deployments use their own repositories.

## Verified release state — 25 November 2026

- PR #7 is merged as `9c3e38435454ea1ff7197709f472bc68a30a5f1e`. GitHub validation run `45516416913` passed the Admin tests, standalone asset build, and protected-entry checks. The floating Adigun BOT controls are verified in source; this run did not deploy the Admin Worker or verify the live interface.
- The current `wrangler.json` has no route and requires `ADIGUN_ADMIN_EMAIL`, `ADIGUN_ACCESS_TEAM_DOMAIN`, `ADIGUN_ACCESS_AUD`, and `GITHUB_TOKEN`. `platform/admin-deployment.mjs` generates an unrouted configuration by default. Do not attach the production hostname until Cloudflare Access policy and required secrets are verified.
- The security report currently combines the Admin build identity, GitHub branch/release metadata, passive checks of published company routes, Supabase Auth audit events, and Admin action records. It does not ingest Cloudflare Access denials, MFA policy state, geo/device signals, IP reputation, or a vulnerability database; therefore it is not yet a complete SIEM feed.
- The terminal Sandbox is explicitly offline and bounded. It does not provide arbitrary production shell access or internet-based reconnaissance. Keep those capabilities separate from the real, currently verified report sources.
- Local `node --test platform/*.test.mjs` passed 75/75. A local rebuild was not run because `dist-admin/` already exists and `platform/build.mjs` refuses to overwrite it; the existing ignored build identifies older source commit `64edac807d16d36e66efc0a537fb6cb35f8d83e4`. The merged GitHub run is the current build evidence.

## Local checkpoint — not deployed

- The Admin toolbar now reads `/api/admin/security/session`, which verifies the current Cloudflare Access owner session. Its account dot is green only after a verified identity response; a failed check stays unverified.
- The Admin workspace keeps the shared company footer, logo, attribution, and social links. The workspace adds only an icon-only back-to-top control.
- `node --test platform/*.test.mjs` passes 77/77 after these changes. A clean production build and live browser check remain outstanding; do not attach the Admin hostname until the Cloudflare Access policy and required secrets are confirmed.
