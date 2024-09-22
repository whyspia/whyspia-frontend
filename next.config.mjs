/** @type {import('next').NextConfig} */
const nextConfig = {
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
}

export default nextConfig
