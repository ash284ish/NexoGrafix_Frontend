import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    'nexografix.com',
    'www.nexografix.com',
    '93.127.167.166',
    'localhost:8000',
    '0.0.0.0:8000'
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    qualities: [75, 100],
    remotePatterns: [
      { protocol: "https", hostname: "nexografix.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "source.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "themephi.net" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "www.gstatic.com" },
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "/s2/favicons",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "X-Requested-With, Content-Type, Authorization" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },

  async rewrites() {
    const isDev = process.env.NODE_ENV === "development";
    // In development, proxy requests to the local backend on port 8000
    const backendUrl = isDev ? "http://127.0.0.1:8000" : (process.env.NEXT_PUBLIC_API_BASE_URL || "https://nexografix.com");
    return [
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/api/uploads/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
