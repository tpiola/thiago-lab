import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: "/opt/data/projects/thiago-lab",
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
