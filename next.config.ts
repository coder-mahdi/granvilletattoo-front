import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? (isProd ? "/granvilltattoo" : "");

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  sassOptions: {
    additionalData: `$asset-prefix: "${basePath}";`,
  },
  ...(basePath
    ? {
        basePath,
        assetPrefix: `${basePath}/`,
      }
    : {}),
};

export default nextConfig;
