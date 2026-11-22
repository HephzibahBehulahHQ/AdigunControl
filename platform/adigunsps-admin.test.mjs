import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createAdigunSPsAdminClient,ADIGUNSPS_URL} from './adigunsps-admin-client.mjs';
import {adminCopy} from './adigunsps-admin-ui.js';
import {resolveRoute} from './router.mjs';
const approvedId='00000000-0000-4000-8000-000000000001';
const auth={access_token:'test-access',expires_in:3600,user:{id:'reviewer',email:'reviewer@example.test',app_metadata:{role:'admin'}}};
test('AdigunSPs uses its own API and in-memory password session',async()=>{
 const calls=[],responses=[auth,[],[{decision:'approved'}],null];
 const client=createAdigunSPsAdminClient({fetcher:async(url,options)=>{calls.push({url,options});return Response.json(responses.shift());}});
 await client.signIn(' reviewer@example.test ','test password');await client.listReviews();await client.decide(approvedId,'approved','Checked values');await client.signOut();
 assert.ok(calls.every(call=>call.url.startsWith(ADIGUNSPS_URL+'/')));
 assert.ok(calls.every(call=>call.options.credentials==='omit'));
 assert.equal(JSON.parse(calls[0].options.body).email,'reviewer@example.test');
 assert.equal(calls[1].options.headers['accept-profile'],'adigunsps');
 const body=JSON.parse(calls[2].options.body);assert.deepEqual(body,{submission_id:approvedId,decision:'approved',comment:'Checked values'});
 assert.ok(!Object.hasOwn(body,'reviewer_id'));assert.match(calls[3].url,/logout\?scope=local$/);
 await assert.rejects(client.listReviews(),/Sign in/);
});
test('non-admin and anonymous sessions cannot administer the product',async()=>{
 for(const user of [{id:'member',app_metadata:{}},{id:'guest',is_anonymous:true,app_metadata:{role:'admin'}}]){
  const client=createAdigunSPsAdminClient({fetcher:async()=>Response.json({...auth,user})});
  await assert.rejects(client.signIn('user@example.test','password'),/administrator/);
  await assert.rejects(client.listReviews(),/Sign in/);
 }
});
test('expired sessions fail before requesting recipe data',async()=>{
 let clock=0,calls=0;const client=createAdigunSPsAdminClient({now:()=>clock,fetcher:async()=>{calls++;return Response.json({...auth,expires_in:1});}});
 await client.signIn('reviewer@example.test','password');clock=1001;await assert.rejects(client.listReviews(),/again/);assert.equal(calls,1);
});
test('review asset routes stay private on every public host',()=>{
 for(const file of ['adigunsps-admin-ui.js','adigunsps-admin-client.mjs']){
  for(const host of ['hephzibahbehulah.com','cyber.hephzibahbehulah.com'])assert.equal(resolveRoute(new URL('https://'+host+'/_hb/'+file)).status,404);
  assert.equal(resolveRoute(new URL('https://admin.hephzibahbehulah.com/_hb/'+file)).privateHost,true);
 }
});
test('four-language panel copy and product separation stay intact',()=>{
 const keys=Object.keys(adminCopy('en'));for(const lang of ['en','de','yo','pcm'])for(const key of keys)assert.ok(adminCopy(lang)[key]);
 const client=fs.readFileSync(new URL('./adigunsps-admin-client.mjs',import.meta.url),'utf8');
 assert.doesNotMatch(client,/vnckoocsookbaqalybje|service_role|localStorage|sessionStorage|\/api\/admin\/accounts/);
 const build=fs.readFileSync(new URL('./build.mjs',import.meta.url),'utf8');assert.ok(build.includes('adigunsps-admin-client.mjs'));
 const platform=fs.readFileSync(new URL('./platform.js',import.meta.url),'utf8');assert.doesNotMatch(platform,/adigunsps-admin-ui/);
 const portfolio=fs.readFileSync(new URL('../apps/admin/_hb/admin-cinema/portfolio.js',import.meta.url),'utf8');
 assert.ok(portfolio.includes("selected?.name.toLowerCase() === 'adigunsps'"));
 assert.ok(portfolio.includes("import('/_hb/adigunsps-admin-ui.js')"));
});

test('verified Admin endpoint waits for an email code and uses only the returned product session',async()=>{
 const endpoint='https://adigunsps.hephzibahbehulah.com/api/account';
 const calls=[],responses=[{step:'verify'},{step:'signed-in',session:{access_token:'test-verified',expires_in:3600,user:{id:'reviewer',email:'reviewer@example.test',role:'admin'}}},[]];
 const client=createAdigunSPsAdminClient({accountEndpoint:endpoint,fetcher:async(url,options)=>{
  calls.push({url,options});return Response.json(responses.shift());
 }});
 await assert.rejects(client.signIn('reviewer@example.test','test password'),/email/);
 await client.beginSignIn('reviewer@example.test','test password');
 await assert.rejects(client.listReviews(),/again/);
 assert.equal((await client.verifySignIn('123456')).id,'reviewer');
 await client.listReviews();
 assert.equal(calls[0].url,endpoint);
 assert.equal(calls[1].options.credentials,'include');
 assert.equal(calls[2].options.headers.authorization,'Bearer test-verified');
});
