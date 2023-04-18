const { createProxyMiddleware } = require('http-proxy-middleware');

const apiProxy = createProxyMiddleware('/api', {
  target: 'https://api.beet.digital',
  changeOrigin: true,
});

module.exports = { apiProxy };
