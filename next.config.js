module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
   
      {
        source: "/api/:path*",
        destination: "http://api.beet.digital/api/:path*",
      },
    ];
   },
};
