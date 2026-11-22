# Adigun Control

Private source repository for admin.hephzibahbehulah.com.

Build the Admin assets with `node platform/build.mjs` and run the local checks with `node --test platform/*.test.mjs`. Workers.dev and version preview URLs are disabled for both environments.

Run \`node platform/admin-deployment.mjs preview\` or \`node platform/admin-deployment.mjs production\` to generate an unrouted Wrangler configuration. Each Worker has its own Sandbox. Add the \`route\` argument to generate a configuration that attaches that environment’s Admin hostname. Verify Cloudflare Access protection and the required Worker secrets before deploying the routed configuration.

Public marketing pages and individual product deployments use their own repositories.
