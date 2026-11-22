import platform, {Sandbox} from './worker-platform.mjs';

export {Sandbox};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.hostname !== 'admin.hephzibahbehulah.com') {
      return new Response('Not found', {
        status: 404,
        headers: {'cache-control': 'no-store', 'x-robots-tag': 'noindex'},
      });
    }
    return platform.fetch(request, env, ctx);
  },
};
