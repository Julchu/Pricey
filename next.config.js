/** @type {import('next').NextConfig} */
const nextConfig = {};

// !! WARN !!
// Dangerously allow production builds to successfully complete even if
// your project has type errors.
// !! WARN !!
const typeScript = {
  ignoreBuildErrors: false,
};

const images = {
  domains: ['avatars.githubusercontent.com'],
  loader: 'akamai',
  path: '',
};

const firebaseConfig = {
  apiKey: process.env.firebaseApiKey,
  authDomain: process.env.firebaseAuthDomain,
  projectId: process.env.firebaseProjectId,
  storageBucket: process.env.firebaseStorageBucket,
  messagingSenderId: process.env.firebaseMessagingSenderId,
  appId: process.env.firebaseAppId,
  measurementId: process.env.firebaseMeasurementId,
  emulatorEnabled: process.env.firebaseEmulatorEnabled,
};

// Needed to pass firebase config
const publicRuntimeConfig = {
  // Will be available on both server and client
  staticFolder: '/static',
  firebaseConfig,
};

const experimental = {
  emotion: true,
};

module.exports = {
  nextConfig,
  typeScript,
  images,
  publicRuntimeConfig,
  experimental,
  swcMinify: true,
  trailingSlash: false,
  reactStrictMode: true,
};
