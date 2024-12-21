/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable React Strict Mode bc it enabled by default and causes TWO modals from one click - which is annoying ass mf issue. Strict mode basically calls useEffects twice for debuggin purposes
  async rewrites() {
    return [
      {
        source: '/place/thinking-about-you',
        destination: '/place/thinking-about-u',
      },
      {
        source: '/place/tau',
        destination: '/place/thinking-about-u',
      },
      {
        source: '/place/tay',
        destination: '/place/thinking-about-u',
      },
      // {
      //   source: '/page4',
      //   destination: '/thinking-about-u',
      // },
    ]
  },
}

export default nextConfig
