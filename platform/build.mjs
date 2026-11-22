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
copy('cyber-os', 'cyber-os');
copy('apps/cyber-os', 'cyber-os');
copySharedAssets(root, destination);

if (process.env.HB_ADIGUNSPS_ACCOUNT_VERIFIED === 'true') {
  const file = path.join(destination, 'admin.html');
  const html = fs.readFileSync(file, 'utf8');
  if (!/<\/head>/i.test(html)) throw new Error('Missing Admin HTML head.');
  fs.writeFileSync(file, html.replace(/<\/head>/i, '<meta name="hb-adigunsps-account" content="verified"></head>'));
}
for (const file of ['platform.js', 'admin-workspace.js', 'platform.css', 'experience.js', 'experience.css', 'admin-security-ui.js', 'admin-accounts-ui.js', 'adigunsps-admin-ui.js', 'adigunsps-admin-client.mjs']) {
  copy('platform/' + file, '_hb/' + file);
}
for (const file of ['hb-logo.svg', 'hephzibah-behulah-official.jpg']) copy('packages/shared-ui/assets/' + file, '_hb/' + file);
copy('packages/shared-i18n/language-system.js', '_hb/language-system.js');
copy('packages/shared-ui/css/sitewide-osint-theme.css', '_hb/sitewide-osint-theme.css');
copy('packages/shared-data/data/translations', '_hb/data/translations');
for (const file of ['source-library.json', 'ai-platform.json']) copy('packages/shared-data/data/' + file, 'data/' + file);
const commitHash = process.env.GITHUB_SHA || execFileSync('git', ['rev-parse', 'HEAD'], {cwd: root, encoding: 'utf8'}).trim();
fs.writeFileSync(path.join(destination, '_hb/status-build.json'), JSON.stringify({commitHash, buildTimestamp: new Date().toISOString()}));


for (const entry of ['admin.html', 'admin-tools.html', 'cyber-os/index.html']) {
  const html = fs.readFileSync(path.join(destination, entry), 'utf8');
  const base = new URL(entry, 'https://admin.invalid/');
  for (const [, reference] of html.matchAll(/<(?:script|link|img|video|source)[^>]*?(?:src|href)="([^"]+)"/gi)) {
    const url = new URL(reference, base);
    if (url.origin !== base.origin) continue;
    if (!fs.statSync(path.join(destination, decodeURIComponent(url.pathname)), {throwIfNoEntry: false})?.isFile()) {
      throw new Error(entry + ' references missing asset ' + url.pathname);
    }
  }
}
