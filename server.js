const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const API_TARGET = 'http://api.beet.digital';

const app = express();

app.use(
  '/api',
  createProxyMiddleware({
    target: API_TARGET,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/',
    },
  }),
);

app.listen(3000, () => {
  console.log(`Server listening on http://localhost:3000`);
});
