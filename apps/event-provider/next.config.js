/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  reactStrictMode: false,
  experimental: {
    transpilePackages: ["ui"],
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM *'
          }
        ],
      },
    ]
  }
};
