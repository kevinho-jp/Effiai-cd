import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Désactive la vérification TypeScript lors du build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
