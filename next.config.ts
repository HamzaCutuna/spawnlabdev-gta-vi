import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    qualities: [75, 80, 85],
  },
  async redirects() {
    return [{ source: "/index", destination: "/archive", permanent: true }];
  },
};

export default nextConfig;
