/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

// !! WARN !!
// Dangerously allow production builds to successfully complete even if
// your project has type errors.
// !! WARN !!
const typeScript = {
  ignoreBuildErrors: false,
}

module.exports = { nextConfig, typeScript }
