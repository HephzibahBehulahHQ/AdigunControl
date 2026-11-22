import test from 'node:test';
import assert from 'node:assert/strict';
import {createPlatform,resolveRoute} from './router.mjs';

const root='hephzibahbehulah.com';

test('engineering suite routes retire after the private access check',()=>{const route=resolveRoute(new URL('https://admin.'+root+'/engineering/simulator'));assert.equal(route.kind,'retired');assert.equal(route.privateHost,true);});

test('ADIGUN operations alias serves the central private control page',()=>{for(const path of ['/and','/and/']){const route=resolveRoute(new URL('https://admin.'+root+path));assert.deepEqual(route,{kind:'app',privateHost:true,app:'admin',prefix:'',base:'/',path:'/admin.html'});}});

test('signed-in operations alias serves admin.html with private response headers',async()=>{let assetPath='';const worker=createPlatform({verifyAdmin:async()=>({ok:true,actor:'owner@example.test'})});const response=await worker.fetch(new Request('https://admin.'+root+'/and'),{ASSETS:{fetch:async request=>{assetPath=new URL(request.url).pathname;return new Response('<html><head></head><body>ADIGUN Control</body></html>',{headers:{'content-type':'text/html'}});}}});assert.equal(response.status,200);assert.equal(assetPath,'/admin.html');assert.equal(response.headers.get('cache-control'),'private, no-store');assert.match(response.headers.get('x-robots-tag'),/noindex/);assert.match(await response.text(),/ADIGUN Control/);});

test('every private request is checked before asset or legacy access',async()=>{let touched=false;const worker=createPlatform({verifyAdmin:async()=>({ok:false}),legacy:{fetch:()=>{touched=true;}}});for(const host of ['admin.'+root])for(const p of ['/','/and','/and/','/engineering/','/_hb/platform.js','/api/admin/agent']){const r=await worker.fetch(new Request('https://'+host+p),{});assert.equal(r.status,401);}assert.equal(touched,false);});

test('missing access configuration fails closed',async()=>{const worker=createPlatform({verifyAdmin:async()=>({ok:false,status:503})});assert.equal((await worker.fetch(new Request('https://admin.'+root+'/'))).status,503);});

test('private responses cannot be cached publicly',async()=>{const worker=createPlatform({verifyAdmin:async()=>({ok:true}),legacy:{fetch:async()=>new Response('existing tools')}});for(const p of ['/engineering/style.css','/']){const r=await worker.fetch(new Request('https://admin.'+root+p),{ASSETS:{fetch:async()=>new Response('css')}});assert.equal(r.headers.get('cache-control'),'private, no-store');}});

test('admin-domain root retains its control-room route',async()=>{
 const worker=createPlatform({verifyAdmin:async()=>({ok:true}),legacy:{fetch:async request=>{assert.equal(new URL(request.url).pathname,'/');return new Response('admin control');}}});
 assert.equal(await(await worker.fetch(new Request('https://admin.'+root+'/'),{})).text(),'admin control');
});

test('private pages cannot reuse stale public HTML through conditional requests',async()=>{
 const worker=createPlatform({verifyAdmin:async()=>({ok:true}),legacy:{fetch:async(request)=>{assert.equal(request.headers.has('if-none-match'),false);assert.equal(request.headers.has('if-modified-since'),false);return new Response('<html></html>',{headers:{'content-type':'text/html',etag:'old-public-version','last-modified':'yesterday'}});}}});
 const result=await worker.fetch(new Request('https://admin.'+root+'/admin',{headers:{'if-none-match':'old-public-version','if-modified-since':'yesterday'}}),{});
 assert.equal(result.status,200);assert.equal(result.headers.has('etag'),false);assert.equal(result.headers.has('last-modified'),false);assert.equal(result.headers.get('cache-control'),'private, no-store');
});

test('private service workers retire only after authorization',async()=>{
 let granted=false;const worker=createPlatform({verifyAdmin:async()=>({ok:granted})});
 const request=new Request('https://admin.'+root+'/engineering/service-worker.js');
 assert.equal((await worker.fetch(request,{})).status,401);granted=true;
 const result=await worker.fetch(request,{});assert.equal(result.status,200);assert.match(await result.text(),/registration\.unregister/);assert.equal(result.headers.get('cache-control'),'private, no-store');
});

test('private engineering surfaces require Access and then return 404',async()=>{const worker=createPlatform({verifyAdmin:async()=>({ok:false})});assert.equal((await worker.fetch(new Request('https://admin.'+root+'/engineering/tools'),{})).status,401);const authorized=createPlatform({verifyAdmin:async()=>({ok:true})});assert.equal((await authorized.fetch(new Request('https://admin.'+root+'/engineering/tools'),{})).status,404);});

test('private tools and Cyber OS receive their correct stylesheet base without public membership scripts',async()=>{const previous=globalThis.HTMLRewriter;globalThis.HTMLRewriter=class{on(selector,handler){this.handler=handler;return this;}transform(){let html='';this.handler.element({prepend:value=>{html=value;}});return new Response(html);}};try{const platform=createPlatform({verifyAdmin:async()=>({ok:true}),legacy:{fetch:async()=>new Response('<html><head></head></html>',{headers:{'content-type':'text/html'}})}});for(const [path,base]of [['/admin/tools/','/'],['/admin/cyber-os/','/cyber-os/']]){const r=await platform.fetch(new Request('https://admin.hephzibahbehulah.com'+path),{});const html=await r.text();assert.ok(html.includes('<base href="'+base+'">'));assert.equal(html.includes('/_hb/member.js'),false);}}finally{if(previous)globalThis.HTMLRewriter=previous;else delete globalThis.HTMLRewriter;}});
