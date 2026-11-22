import fs from 'node:fs';

const deployments = {
  preview: {
    name: 'adigun-control-preview',
    host: 'admin-preview.hephzibahbehulah.com',
    sandbox: 'adigun-control-preview-sandbox',
  },
  production: {
    name: 'adigun-control',
    host: 'admin.hephzibahbehulah.com',
    sandbox: 'adigun-control-production-sandbox',
  },
};
const [target, mode = 'stage', ...extra] = process.argv.slice(2);
if (!Object.hasOwn(deployments, target) || !['stage', 'route'].includes(mode) || extra.length) {
  throw new Error('Usage: node platform/admin-deployment.mjs <preview|production> [stage|route]');
}

const base = new URL('../wrangler.json', import.meta.url);
const config = JSON.parse(fs.readFileSync(base, 'utf8'));
const deployment = deployments[target];
config.name = deployment.name;
config.vars.ADIGUN_ADMIN_HOST = deployment.host;
config.containers = config.containers.map(container =>
  container.class_name === 'Sandbox' ? {...container, name: deployment.sandbox} : container
);
config.routes = mode === 'route' ? [{pattern: deployment.host, custom_domain: true}] : [];
config.workers_dev = false;
config.preview_urls = false;
const output = new URL('../wrangler.generated-' + target + '.json', import.meta.url);
fs.writeFileSync(output, JSON.stringify(config, null, 2) + '\n');
console.log('Prepared ' + target + ' configuration for ' + deployment.name + ' (' + mode + ').');
