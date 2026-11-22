import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {copySharedAssets} from './release-assets.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const destination = path.join(root, 'dist-admin');
if (fs.existsSync(destination)) throw new Error('dist-admin already exists. Move the previous build before rebuilding.');
fs.mkdirSync(destination);
const copy = (from, to) => fs.cpSync(path.join(root, from), path.join(destination, to), {recursive: true});
copy('apps/admin', '.');
copy('apps/cyber-os', 'cyber-os');
copySharedAssets(root, destination);

if (process.env.HB_ADIGUNSPS_ACCOUNT_VERIFIED === 'true') {
  const file = path.join(destination, 'admin.html');
  const html = fs.readFileSync(file, 'utf8');
  if (!/<\/head>/i.test(html)) throw new Error('Missing Admin HTML head.');
  fs.writeFileSync(file, html.replace(/<\/head>/i, '<meta name="hb-adigunsps-account" content="verified"></head>'));
}
for (const file of ['platform.js', 'platform.css', 'experience.js', 'experience.css', 'admin-security-ui.js', 'admin-accounts-ui.js', 'adigunsps-admin-ui.js', 'adigunsps-admin-client.mjs']) {
  copy('platform/' + file, '_hb/' + file);
}
for (const file of ['hb-logo.svg', 'hephzibah-behulah-official.jpg']) copy('packages/shared-ui/assets/' + file, '_hb/' + file);
copy('packages/shared-i18n/language-system.js', '_hb/language-system.js');
copy('packages/shared-ui/css/sitewide-osint-theme.css', '_hb/sitewide-osint-theme.css');
copy('packages/shared-data/data/translations', '_hb/data/translations');
const commitHash = process.env.GITHUB_SHA || execFileSync('git', ['rev-parse', 'HEAD'], {cwd: root, encoding: 'utf8'}).trim();
fs.writeFileSync(path.join(destination, '_hb/status-build.json'), JSON.stringify({commitHash, buildTimestamp: new Date().toISOString()}));
