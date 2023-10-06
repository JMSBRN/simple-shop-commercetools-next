/** @type {import('next').NextConfig} */
const path = require('path');
const { i18n } = require('./next-i18next.config.js');

const nextConfig = {
  i18n,
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
  },
  images: {
    // eslint-disable-next-line max-len
    domains: ['1d764c24b481bf3d7f78-bc00b23398ecbb1e7f6f5821c0a15373.ssl.cf3.rackcdn.com']
  },
  env: {
    PROJECT_KEY: process.env.PROJECT_KEY,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CLIENT_ID: process.env.CLIENT_ID,
    AUTH_URL: process.env.AUTH_URL,
    API_URL: process.env.API_URL,
    SCOPES: process.env.SCOPES,
    ANONIMOUS_ID: process.env.ANONIMOUS_ID,
  },
};

module.exports = nextConfig;
