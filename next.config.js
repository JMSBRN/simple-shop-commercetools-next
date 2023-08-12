/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
  },
  env: {
    PROJECT_KEY: process.env.PROJECT_KEY,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CLIENT_ID: process.env.CLIENT_ID,
    AUTH_URL: process.env.AUTH_URL,
    API_URL: process.env.API_URL,
    SCOPES: process.env.SCOPES,
  },
  i18n: {
    locales: ['en', 'de'],
    defaultLocale: 'en',
  }
};

module.exports = nextConfig;
