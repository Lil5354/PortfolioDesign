/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/:path((?!api/|_next/|.*\\..*$).*)",
        destination: "/index.html",
      },
    ];
  },
};

export default nextConfig;
