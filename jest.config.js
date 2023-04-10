module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '/\.js$|jsx/': ['babel-jest', {
      presets: ['@babel/preset-env', '@babel/preset-react']
    }],
  },
  setupFilesAfterEnv: ['./setupTests.js'],
  moduleFileExtensions: ['js', 'jsx'],
  testMatch: [
    '**/__tests__/**/*.js?(x)',
    '**/?(*.)+(spec|test).js?(x)',
  ]
};