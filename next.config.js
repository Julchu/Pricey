/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

// !! WARN !!
// Dangerously allow production builds to successfully complete even if
// your project has type errors.
// !! WARN !!
const typeScript = {
  ignoreBuildErrors: false,
};

const images = {
  domains: ['avatars.githubusercontent.com'],
};

module.exports = { nextConfig, typeScript, images };
