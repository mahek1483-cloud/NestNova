import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 80],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns"],
  },
  async rewrites() {
    return [
      {
        source: "/student/search",
        destination: "/search",
      },
      {
        source: "/student/food",
        destination: "/food",
      },
      {
        source: "/student/food/:slug",
        destination: "/food/:slug",
      },
      {
        source: "/student/property/:slug",
        destination: "/property/:slug",
      },
      {
        source: "/student/compare",
        destination: "/compare",
      },
      {
        source: "/student/saved",
        destination: "/saved",
      },
      {
        source: "/student/enquiries",
        destination: "/enquiries",
      },
      {
        source: "/student/bookings",
        destination: "/bookings",
      },
      {
        source: "/student/payments",
        destination: "/payments",
      },
      {
        source: "/student/messages",
        destination: "/messages",
      },
      {
        source: "/student/notifications",
        destination: "/notifications",
      },
      {
        source: "/student/profile",
        destination: "/profile",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self' data:; connect-src 'self' https: http:;",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(self), geolocation=(self)",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
