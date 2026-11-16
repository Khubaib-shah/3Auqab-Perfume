import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cpus: 1,
    agentUpgrade: "security",
  },
};

export default nextConfig;
