import type { NextConfig } from "next";
import path from "path";

const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim();
const normalizedBasePath = rawBasePath && rawBasePath !== "/"
  ? `/${rawBasePath.replace(/^\/+|\/+$/g, "")}`
  : "";

const nextConfig: NextConfig = {
  // Avoid wrong root when another lockfile exists above this repo (local + CI).
  outputFileTracingRoot: path.join(__dirname),
  images: { unoptimized: true },
  trailingSlash: true,
  sassOptions: {
    additionalData: `$asset-prefix: "${normalizedBasePath}";`,
  },
  ...(normalizedBasePath
    ? {
        basePath: normalizedBasePath,
        assetPrefix: `${normalizedBasePath}/`,
      }
    : {}),
};

export default nextConfig;
