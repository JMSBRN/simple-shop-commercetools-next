/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
  },
  images: {
    // eslint-disable-next-line max-len
    domains: ['607c34ad0a5bf735fdf7-ec12c9005026a0c273dadf2c3ac4444b.ssl.cf3.rackcdn.com', 'db4907a8a82a43284da3-3cf85548c8e7f92803abeb654b3545a6.ssl.cf3.rackcdn.com']
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
