 /** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
      domains: ['cdn.iconscout.com', 'ui-avatars.com'],
    },
  }
  
  module.exports = nextConfig;
