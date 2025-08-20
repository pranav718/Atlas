import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ...other configurations
  typescript: {
    // !! WARN !!
    // This setting is dangerous. It allows the build to succeed even if your project has type errors.
    // Use with caution, and aim to fix the underlying issues instead.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;