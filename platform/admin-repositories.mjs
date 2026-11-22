const organization = 'HephzibahBehulahHQ';

function response(data, status = 200) {
  return Response.json(data, {status, headers: {'cache-control': 'private, no-store'}});
}

export async function adminRepositories(request, env, verified, fetcher = fetch) {
  if (!verified?.ok || !verified.identity?.email) return response({error: 'Owner sign-in required'}, 401);
  if (request.method !== 'GET') return response({error: 'Read-only endpoint'}, 405);
  if (!env.ADMIN_AI_LIMITER?.limit) return response({error: 'Repository inventory is not configured'}, 503);
  if (!(await env.ADMIN_AI_LIMITER.limit({key: 'admin-repositories:' + verified.identity.email})).success) {
    return response({error: 'Please wait before refreshing'}, 429);
  }

  async function list(token, search = false) {
    const repositories = [];
    for (let page = 1; page <= 20; page++) {
      const endpoint = new URL(search ? 'https://api.github.com/search/repositories' : 'https://api.github.com/orgs/' + organization + '/repos');
      const filters = search ? {q:'org:' + organization + ' is:public',sort:'created',order:'desc'} : {type:token?'all':'public',sort:'created',direction:'desc'};
      endpoint.search = new URLSearchParams({...filters,per_page:'100',page:String(page)});
      const headers = {accept:'application/vnd.github+json', 'user-agent':'HB-Private-Repository-Inventory'};
      if (token) headers.authorization = 'Bearer ' + token;
      const upstream = await fetcher(endpoint, {headers, redirect:'error', signal:AbortSignal.timeout(6000)});
      if (!upstream.ok) throw new Error('GitHub inventory is unavailable');
      const payload = await upstream.json();
      const batch = search ? payload.items : payload;
      if (!Array.isArray(batch)) throw new Error('Invalid GitHub inventory response');
      for (const repo of batch) {
        if (repo.archived || repo.fork || typeof repo.name !== 'string' || !/^[a-z0-9_.-]+$/i.test(repo.name) || repo.name === '.' || repo.name === '..') continue;
        if (!token && repo.visibility !== 'public') continue;
        repositories.push({
          name:repo.name,
          url:'https://github.com/' + organization + '/' + encodeURIComponent(repo.name),
          visibility:repo.visibility === 'public' ? 'Public' : 'Private',
          createdAt:typeof repo.created_at === 'string' ? repo.created_at : null
        });
      }
      if (batch.length < 100) return repositories;
    }
    throw new Error('Repository inventory exceeded its configured page limit');
  }

  const [publicList, credentialList] = await Promise.allSettled([
    list().catch(() => list(undefined, true)), env.GITHUB_TOKEN ? list(env.GITHUB_TOKEN) : Promise.reject(new Error('No GitHub credential'))
  ]);
  if (publicList.status !== 'fulfilled' && credentialList.status !== 'fulfilled') {
    return response({error:'GitHub repository inventory is unavailable'}, 502);
  }
  const repositories = new Map();
  for (const batch of [publicList, credentialList]) {
    if (batch.status === 'fulfilled') for (const repo of batch.value) repositories.set(repo.name.toLowerCase(),repo);
  }
  return response({
    repositories:[...repositories.values()].sort((a,b)=>(b.createdAt||'').localeCompare(a.createdAt||'')),
    coverage:credentialList.status === 'fulfilled' ? 'Private coverage is limited to the configured GitHub credential' : 'Public GitHub repositories only'
  });
}
