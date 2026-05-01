/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Content-Type",
            value: "application/xml; charset=utf-8"
          }
        ]
      }
    ];
  },
  experimental: {
    cpus: 1,
    workerThreads: true,
    webpackBuildWorker: false,
    typedRoutes: false
  }
};

export default nextConfig;
