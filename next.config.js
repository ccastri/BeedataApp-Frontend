module.exports = {
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add custom Babel configuration to ignore license files
    config.module.rules.push({
      test: /\.(js|mjs)$/,
      include: /node_modules/,
      exclude: /@babel(?:\/|\\{1,2})plugin-/,
      use: [
        defaultLoaders.babel,
        {
          loader: 'ignore-loader',
          options: {
            ignore: [
              // Add the license files that you want to ignore here
              /\.\/LICENSE$/,
            ],
          },
        },
      ],
    });

    return config;
  },
};
