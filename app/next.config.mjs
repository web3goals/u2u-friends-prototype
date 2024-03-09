/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    config.externals.push("pino-pretty", "encoding");
    return config;
  },
};

export default nextConfig;
