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
      },
      {
        source: "/novalure-logo-email.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*"
          }
        ]
      }
    ];
  },
  experimental: {
    cpus: 1,
    workerThreads: false,
    webpackBuildWorker: false
  }
};

export default nextConfig;
