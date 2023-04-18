const { apiProxy } = require('./apiProxy');

module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/api/:path*', destination: '/api/:path*' },
      { source: '/api', destination: '/api/' },
    ];
  },
  async serverMiddleware() {
    return [
      apiProxy,
    ];
  },
};
