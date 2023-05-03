module.exports = {
  reactStrictMode: true,
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
    CRYPTO_KEY: process.env.CRYPTO_KEY,
    CRYPTO_IV: process.env.CRYPTO_IV,
    CRYPTO_ALGORITHM: process.env.CRYPTO_ALGORITHM,
  }
};
