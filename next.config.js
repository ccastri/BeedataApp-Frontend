module.exports = {
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Ignore README.md file for @babel/plugin-syntax-bigint
    config.module.rules.push({
      test: /@babel\/plugin-syntax-bigint/,
      use: 'null-loader',
    });

    return config;
  },
};
