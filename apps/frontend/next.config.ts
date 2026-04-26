import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ["@mda/components", "@common/types"],
  },
  async rewrites() {
    const backendUrl =
      process.env.BACKEND_URL ?? "http://backend:3001/api/v1";
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
