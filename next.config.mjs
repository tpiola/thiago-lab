/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
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
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*.:ext(avif|webp|png|jpg|jpeg|svg|woff2)",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
