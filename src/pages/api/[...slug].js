import { createProxyMiddleware } from 'http-proxy-middleware';

const proxy = createProxyMiddleware({
  // Replace with your target URL here
  target: 'https://api.beet.digital',
  changeOrigin: true,
  // Prevents some security issues
  cookieDomainRewrite: '',
  onProxyReq: (proxyReq) => {
    // Remove any `X-Forwarded-*` headers sent by the client
    Object.keys(proxyReq.headers)
      .filter((key) => key.startsWith('x-forwarded'))
      .forEach((key) => delete proxyReq.headers[key]);
    // Add or modify headers as necessary
    proxyReq.setHeader('User-Agent', 'proxy-agent');
  },
});

export default function handler(req, res) {
  // Note: This assumes your Next.js app is running on the root path '/'
  const [_, ...slug] = req.query.slug || [];
  const targetUrl = `/${slug.join('/')}`;
  return proxy(req, res, { target: targetUrl });
}
