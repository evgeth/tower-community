export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const prefix = '/tower-2-confidential';

    if (url.pathname === prefix) {
      return Response.redirect(url.origin + prefix + '/', 301);
    }

    if (url.pathname.startsWith(prefix + '/')) {
      const newPath = url.pathname.slice(prefix.length) || '/';
      const assetUrl = new URL(newPath + url.search, url.origin);
      return env.ASSETS.fetch(new Request(assetUrl, request));
    }

    return new Response('Not Found', { status: 404 });
  }
};
