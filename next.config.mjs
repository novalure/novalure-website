/** @type {import('next').NextConfig} */
const nextConfig = {
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
