import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  NEXT_PUBLIC_ENDPOINT: process.env.NEXT_PUBLIC_ENDPOINT,
};

module.exports = nextConfig

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactStrictMode: true, // Optional: Ensures best practices in React
// };

// export default nextConfig;
