import assert from 'node:assert/strict';
import test from 'node:test';
import {adminRepositories} from './admin-repositories.mjs';
import {resolveRoute} from './router.mjs';

const route = '/api/admin/repositories';
const request = new Request('https://admin.hephzibahbehulah.com' + route);
const identity = {ok:true, identity:{email:'owner@example.test'}};
const env = {GITHUB_TOKEN:'fixture-only', ADMIN_AI_LIMITER:{limit:async()=>({success:true})}};

test('repository inventory is private and requires a verified owner', async () => {
  assert.equal(resolveRoute(new URL(request.url)).kind, 'admin-repositories');
  assert.equal(resolveRoute(new URL('https://hephzibahbehulah.com' + route)).kind, 'reject');
  const result = await adminRepositories(request, env, null, () => assert.fail('Unexpected upstream call'));
  assert.equal(result.status, 401);
});

test('inventory returns safe repository metadata and excludes forks and archives', async () => {
  const result = await adminRepositories(request, env, identity, async (url, options) => {
    assert.equal(url.hostname, 'api.github.com');
    assert.equal(url.pathname, '/orgs/HephzibahBehulahHQ/repos');
    if (!options.headers.authorization) return Response.json([]);
    assert.equal(options.headers.authorization, 'Bearer fixture-only');
    return Response.json([
      {name:'NewProduct', visibility:'private', description:'Internal description'},
      {name:'Archived', archived:true},
      {name:'Forked', fork:true},
      {name:'../Unsafe'}
    ]);
  });
  assert.equal(result.status, 200);
  assert.equal(result.headers.get('cache-control'), 'private, no-store');
  assert.deepEqual((await result.json()).repositories, [{
    name:'NewProduct', url:'https://github.com/HephzibahBehulahHQ/NewProduct', visibility:'Private', createdAt:null
  }]);
});
