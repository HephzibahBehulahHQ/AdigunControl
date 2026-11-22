import platform, {Sandbox} from './worker-platform.mjs';

export {Sandbox};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const host = env.ADIGUN_ADMIN_HOST || 'admin.hephzibahbehulah.com';
    if (url.hostname !== host) {
      return new Response('Not found', {
        status: 404,
        headers: {'cache-control': 'no-store', 'x-robots-tag': 'noindex'},
      });
    }
    return platform.fetch(request, env, ctx);
  },
};
