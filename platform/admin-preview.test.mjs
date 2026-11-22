import test from 'node:test';
import assert from 'node:assert/strict';
import {createPlatform} from './router.mjs';

test('Admin preview activates private menus only after Access verification', async t => {
  const selectors = new Map();
  t.mock.method(globalThis, 'fetch', async () => { throw new Error('Unexpected network access'); });
  const original = globalThis.HTMLRewriter;
  t.after(() => {
    if (original === undefined) delete globalThis.HTMLRewriter;
    else globalThis.HTMLRewriter = original;
  });
  globalThis.HTMLRewriter = class {
    on(selector, handler) { selectors.set(selector, handler); return this; }
    transform(response) { return response; }
  };

  const request = new Request('https://admin-preview.hephzibahbehulah.com/');
  let authenticated = false;
  let assetRequests = 0;
  const platform = createPlatform({
    verifyAdmin: async () => ({ok: authenticated}),
    legacy: {fetch: async received => {
      assetRequests++;
      assert.equal(new URL(received.url).pathname, '/');
      return new Response('<html><head></head></html>', {headers: {'content-type': 'text/html'}});
    }},
  });

  assert.equal((await platform.fetch(request, {})).status, 401);
  assert.equal(assetRequests, 0);
  assert.equal(selectors.size, 0);

  authenticated = true;
  const response = await platform.fetch(request, {});
  assert.equal(response.status, 200);
  assert.equal(assetRequests, 1);
  assert.match(response.headers.get('x-robots-tag'), /noindex/);
  const attributes = new Map();
  selectors.get('html').element({setAttribute: (name, value) => attributes.set(name, value)});
  assert.equal(attributes.get('data-hb-private'), 'true');
});
