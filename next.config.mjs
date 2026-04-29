/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: ".next-novalure",
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    cpus: 1,
    workerThreads: true,
    webpackBuildWorker: false,
    typedRoutes: false
  }
};

export default nextConfig;
