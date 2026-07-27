const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The baseAccount wagmi connector pulls in @coinbase/cdp-sdk, which
  // statically imports optional @x402/* payment modules we don't use
  // (we only need basic wallet connect, not Base's x402 payments
  // feature). Those packages aren't installed, so webpack fails to
  // resolve them. IgnorePlugin tells webpack to skip ANY import
  // matching @x402/... instead of erroring out, whichever submodule
  // it happens to be.
  webpack: (config) => {
    config.plugins.push(new webpack.IgnorePlugin({ resourceRegExp: /^@x402\// }));
    return config;
  },
};

module.exports = nextConfig;
