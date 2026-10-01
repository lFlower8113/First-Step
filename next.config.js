/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  reactStrictMode: false, // sometimes helps with WebGL context retention in dev mode
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'raw.githubusercontent.com'],
  },
};

module.exports = nextConfig;
