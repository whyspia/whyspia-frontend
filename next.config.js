/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/context/thinking-about-you',
        destination: '/context/thinking-about-u',
      },
      {
        source: '/context/tau',
        destination: '/context/thinking-about-u',
      },
      {
        source: '/context/tay',
        destination: '/context/thinking-about-u',
      },
      // {
      //   source: '/page4',
      //   destination: '/thinking-about-u',
      // },
    ]
  },
  async redirects() {
    return [
      // TODO: use this for maintenance and whatevs
      {
        source: '/',
        destination: '/dead',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
