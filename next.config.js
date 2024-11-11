/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.output.globalObject = "self";
    }
    return config;
  },
  swcMinify: true,
  output: "export",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
