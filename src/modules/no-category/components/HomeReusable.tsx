import type { NextPage } from 'next'
import DoStuffUI from './DoStuffUI'

const HomeReusable: NextPage = () => {

  return (
    <div className="text-center px-4 relative z-40">

      <div className="flex justify-center">
        <DoStuffUI />
      </div>

    </div>
  )
}

export default HomeReusable
