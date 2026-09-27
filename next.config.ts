import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Prisma to work correctly in Next.js serverless functions
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
};

export default nextConfig;
