/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    // The blog OG image route renders on demand and reads content/ with fs,
    // so the markdown files must be traced into its serverless bundle.
    outputFileTracingIncludes: {
      "/blog/[slug]/opengraph-image": ["./content/**/*"],
    },
  },
};

export default nextConfig;
