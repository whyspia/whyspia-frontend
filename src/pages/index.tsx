import DefaultLayout from 'components/layouts/DefaultLayout'
import type { NextPage } from 'next'
import HomeReusable from 'modules/no-category/components/HomeReusable'

const Home: NextPage = () => {

  return (
    <HomeReusable />
  )
}

(Home as any).layoutProps = {
  Layout: DefaultLayout,
}

export default Home
