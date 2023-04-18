import httpProxy from "http-proxy";

export const config = {
  api: {
    // Enable `externalResolver` option in Next.js
    externalResolver: true,
    bodyParser: false,
  },
};

export default (req, res) =>
  new Promise((resolve, reject) => {
    const proxy: httpProxy = httpProxy.createProxy();
    proxy.once("proxyRes", resolve).once("error", reject).web(req, res, {
      changeOrigin: true,
      target: "http://api.beet.digital",
    });
});