/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["gods-eye-view", "@meri-imperiumi/eccodes-wasm"],
  outputFileTracingIncludes: {
    "/api/gods-eye-view/*": ["./vendor/gods-eye-view/config/**/*", "./vendor/gods-eye-view/src/data/local_data/cctv_ground_heights/**/*"],
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/intelligence-os",
        permanent: true,
      },
      {
        source: "/analytics",
        destination: "/intelligence-os/analytics",
        permanent: true,
      },
      {
        source: "/agents",
        destination: "/intelligence-os/agents",
        permanent: true,
      },
      {
        source: "/maps",
        destination: "/intelligence-os/maps",
        permanent: true,
      },
      {
        source: "/github-sync",
        destination: "/intelligence-os/github",
        permanent: true,
      },
      {
        source: "/soberania",
        destination: "/intelligence-os",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
