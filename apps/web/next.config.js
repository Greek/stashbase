const path = require('path');

module.exports = {
  reactStrictMode: true,
  transpilePackages: ['@stashbase/ui'],
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
};
