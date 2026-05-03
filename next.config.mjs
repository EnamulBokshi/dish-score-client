/** @type {import('next').NextConfig} */
const nextConfig = {
async rewrites() {
    const backendBaseUrl =
      process.env.API_URL || "https://dish-score-server.vercel.app";

    return [
      {
        source: "/api/:path*",
        destination: `${backendBaseUrl}/api/:path*`,
      },
    ];
  },
}

export default nextConfig
