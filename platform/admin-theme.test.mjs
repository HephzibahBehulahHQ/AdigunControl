import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));

test('private command center and workbench use parent and product wordmarks with valid workspace links', () => {
  const control = fs.readFileSync(path.join(root, 'apps/admin/admin.html'), 'utf8');
  const tools = fs.readFileSync(path.join(root, 'apps/admin/admin-tools.html'), 'utf8');
  const cyber = fs.readFileSync(path.join(root, 'apps/cyber-os/index.html'), 'utf8');
  for (const html of [tools, cyber]) {
    assert.match(html, /class="hb-company-wordmark"><img class="hb-company-logo" src="\/_hb\/hephzibah-behulah-official\.jpg" alt="HEPHZIBAH BEHULAH">/);
    assert.match(html, /class="hb-product-wordmark">ADIGUN/);
  }
  assert.match(control, /class="hb-admin-header-mark" href="#overview"/);
  assert.doesNotMatch(control, /class="os-brand hb-product-lockup"/);
  assert.match(tools, /href="\/admin\/cyber-os\/"[^>]*>⌘ ADIGUN CYBER OS/);
  assert.match(tools, /href="\/admin\/">ADIGUN Control/);
  assert.doesNotMatch(tools, /adigun-contol/);
});

test('ADIGUN command center and Tool Lab omit retired workspaces', () => {
  for (const file of ['apps/admin/admin.html', 'apps/admin/admin-tools.html']) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    assert.doesNotMatch(html, /VoltPro Engineering overview|VoltPro Simulator|VoltPro PLC|VoltPro ElectCAD|VoltPro Breadboard|VoltPro Oscilloscope|VoltPro Electrical/);
    assert.doesNotMatch(html, /href="\/engineering\//);
  }
});

test('Cyber OS carries the parent wordmark and its own product wordmark in the shared theme', () => {
  const html = fs.readFileSync(path.join(root, 'apps/cyber-os/index.html'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'platform/experience.css'), 'utf8');
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'apps/cyber-os/adigun-cyber-os.webmanifest'), 'utf8'));
  const logo = fs.readFileSync(path.join(root, 'apps/cyber-os/assets/adigun-cyber-os.svg'), 'utf8');
  assert.match(html, /HEPHZIBAH BEHULAH/);
  assert.match(html, /ADIGUN/);
  assert.match(html, /Cyber OS/);
  assert.match(html, /a product of HEPHZIBAH BEHULAH/i);
  assert.match(html, /name="theme-color" content="#0b1220"/);
  assert.match(html, /rel="manifest" href="\/cyber-os\/adigun-cyber-os\.webmanifest"/);
  assert.match(html, /rel="icon" type="image\/svg\+xml" href="\/cyber-os\/assets\/adigun-cyber-os\.svg"/);
  assert.equal(manifest.name, 'ADIGUN Cyber OS | HEPHZIBAH BEHULAH');
  assert.equal(manifest.icons[0].src, '/cyber-os/assets/adigun-cyber-os.svg');
  assert.match(logo, /<title id="title">ADIGUN Cyber OS<\/title>/);
  assert.match(css, /\.os-brand\.hb-product-lockup/);
  assert.match(css, /\.hb-company-wordmark/);
  assert.match(css, /\.hb-product-wordmark/);
  assert.match(css, /html\[data-hb-theme=light\] \.hb-product-wordmark/);
});

test('the private sidebar mounts the applications menu and links to the public website',()=>{
 const platform=fs.readFileSync(path.join(root,'platform/platform.js'),'utf8');
 assert.ok(platform.includes("link('Public website','https://'+domain+'/')"));
 assert.match(platform,/sidebar\.querySelector\('\.os-brand'\)\?\.after\(section\)/);
});
