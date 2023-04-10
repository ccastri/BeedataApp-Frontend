module.exports = {
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Exclude LICENSE files from being processed
    config.module.rules.push({
      test: /\.LICENSE$/,
      use: 'null-loader',
    });

    return config;
  },
};
