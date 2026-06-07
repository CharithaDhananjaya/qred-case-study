import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@qred/shared'],
  async headers() {
    return [
      {
        source: '/presentation',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' https://www.canva.com;",
          },
        ],
      },
    ]
  },
}

export default nextConfig
