/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/:path((?!api/).*)",
        destination: "/index.html",
      },
    ];
  },
};

export default nextConfig;
