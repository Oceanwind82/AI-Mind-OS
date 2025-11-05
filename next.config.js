/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: '/', destination: '/home', permanent: false }];
  },
  eslint: {
    // Disable some overly strict rules during builds
    ignoreDuringBuilds: false,
  },
  experimental: {
    // Enable some experimental features if needed
  },
}

module.exports = nextConfig
