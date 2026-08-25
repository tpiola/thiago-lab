/** @type {import('next').NextConfig} */
const nextConfig = {
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
