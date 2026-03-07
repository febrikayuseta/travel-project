/** @type {import('next').NextConfig} */

const nextConfig = {
  // basePath removed to prevent issue with undefined env var

  // 1. Bypass Error ESLint
  eslint: {
    ignoreDuringBuilds: true
  },

  // 2. Bypass Error TypeScript
  typescript: {
    ignoreBuildErrors: true
  },

  // 3. Image optimization settings
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },

  // 4. Custom headers for CORS (if needed)
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' }
        ]
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/front-pages/landing-page',
        permanent: false
      }
    ]
  },

  // Config lainnya...
  ...(process.env.NODE_ENV === 'development' && {
    experimental: {
      serverComponentsExternalPackages: []
    }
  })
}

export default nextConfig
