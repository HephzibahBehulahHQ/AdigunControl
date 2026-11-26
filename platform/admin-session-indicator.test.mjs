import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));

test('Admin header session indicator uses the verified owner session endpoint', () => {
  const ui = fs.readFileSync(path.join(root, 'platform/admin-session-indicator.js'), 'utf8');
  const build = fs.readFileSync(path.join(root, 'platform/build.mjs'), 'utf8');
  const experience = fs.readFileSync(path.join(root, 'platform/experience.js'), 'utf8');
  assert.match(ui, /fetch\('\/api\/admin\/security\/session'/);
  assert.match(ui, /data\.session\?\.email/);
  assert.match(ui, /setState\('active'/);
  assert.match(ui, /setState\('unverified'/);
  assert.match(ui, /\/cdn-cgi\/access\/logout/);
  assert.match(build, /'admin-session-indicator\.js'/);
  assert.match(experience, /if\(privatePage\)loadScript\('\/_hb\/admin-session-indicator\.js'\)/);
});
