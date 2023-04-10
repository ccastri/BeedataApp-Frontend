module.exports = {
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Exclude LICENSE and README.md files from being processed by webpack
    config.module.rules.push({
      test: /\.(LICENSE|README.md)$/,
      loader: 'ignore-loader'
    });

    return config;
  }
};
