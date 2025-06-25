import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'payload-demo-seven.vercel.app',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'payload-demo-vovalukashovs-projects.vercel.app',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'payload-demo-vovalukashov-vovalukashovs-projects.vercel.app',
        port: '',
      },
    ],
  },
  reactStrictMode: true,
  redirects,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
