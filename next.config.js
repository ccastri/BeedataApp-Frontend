module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(md|LICENSE)$/, // Add a rule to handle .md and LICENSE files
      use: 'raw-loader' // Use raw-loader to load these file types as raw text
    });

    return config;
  }
};
