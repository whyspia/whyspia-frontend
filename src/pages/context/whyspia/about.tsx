import classNames from 'classnames'
import A from 'components/A'
import DefaultLayout from 'components/layouts/DefaultLayout'
import type { NextPage } from 'next'

const WhyspiaAbout: NextPage = () => {

  return (
    <div className="text-center px-4 relative z-40">

      <div className="my-6 ">
        <A
          href={`/context/whyspia`}
          className={classNames(
            'p-3 text-white rounded-lg hover:bg-purple-600 border border-purple-600 cursor-pointer'
          )}
        >
          return to whyspia context
        </A>
      </div>

      <div className="text-2xl font-bold">what the heck is this?</div>

      <div className="mt-6">

        <div className="mb-4 ">
          sanctuary for shared whispers of the soul to echo in flux
        </div>


      </div>

    </div>
  )
}

(WhyspiaAbout as any).layoutProps = {
  Layout: DefaultLayout,
}

export default WhyspiaAbout
