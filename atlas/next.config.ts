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
};

export default nextConfig;