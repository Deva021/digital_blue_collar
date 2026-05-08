import type { NextConfig } from "next";

// Validate environment variables on startup
import "./src/lib/env";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
