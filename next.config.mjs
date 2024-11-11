/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable React Strict Mode bc it enabled by default and causes TWO modals from one click - which is annoying ass mf issue. Strict mode basically calls useEffects twice for debuggin purposes
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
