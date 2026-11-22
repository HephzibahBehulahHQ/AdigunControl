const organization = 'HephzibahBehulahHQ';

function response(data, status = 200) {
  return Response.json(data, {status, headers: {'cache-control': 'private, no-store'}});
}

export async function adminRepositories(request, env, verified, fetcher = fetch) {
  if (!verified?.ok || !verified.identity?.email) return response({error: 'Owner sign-in required'}, 401);
  if (request.method !== 'GET') return response({error: 'Read-only endpoint'}, 405);
  if (!env.GITHUB_TOKEN || !env.ADMIN_AI_LIMITER?.limit) return response({error: 'Repository inventory is not configured'}, 503);
  if (!(await env.ADMIN_AI_LIMITER.limit({key: 'admin-repositories:' + verified.identity.email})).success) {
    return response({error: 'Please wait before refreshing'}, 429);
  }

  const repositories = [];
  try {
    for (let page = 1; page <= 20; page++) {
      const endpoint = new URL('https://api.github.com/orgs/' + organization + '/repos');
      endpoint.search = new URLSearchParams({type:'all',sort:'created',direction:'desc',per_page:'100',page:String(page)});
      const upstream = await fetcher(endpoint, {
        headers: {accept:'application/vnd.github+json', authorization:'Bearer ' + env.GITHUB_TOKEN, 'user-agent':'HB-Private-Repository-Inventory'},
        redirect:'error',
        signal:AbortSignal.timeout(8000)
      });
      if (!upstream.ok) return response({error:'GitHub repository inventory is unavailable'}, 502);
      const batch = await upstream.json();
      if (!Array.isArray(batch)) return response({error:'Invalid GitHub inventory response'}, 502);
      for (const repo of batch) {
        if (repo.archived || repo.fork || typeof repo.name !== 'string' || !/^[a-z0-9_.-]+$/i.test(repo.name) || repo.name === '.' || repo.name === '..') continue;
        repositories.push({
          name:repo.name,
          url:'https://github.com/' + organization + '/' + encodeURIComponent(repo.name),
          visibility:repo.visibility === 'public' ? 'Public' : 'Private',
          createdAt:typeof repo.created_at === 'string' ? repo.created_at : null
        });
      }
      if (batch.length < 100) return response({repositories, coverage:'Repositories visible to the configured GitHub credential'});
    }
    return response({error:'Repository inventory exceeded its configured page limit'}, 502);
  } catch {
    return response({error:'GitHub repository inventory is unavailable'}, 502);
  }
}
