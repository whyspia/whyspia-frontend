import classNames from 'classnames'
import A from 'components/A'
import DefaultLayout from 'components/layouts/DefaultLayout'
import type { NextPage } from 'next'

const ParallelAbout: NextPage = () => {

  return (
    <div className="text-center px-4 relative z-40">

      <div className="my-6 ">
        <A
          href={`/place/parallel`}
          className={classNames(
            'p-3 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer'
          )}
        >
          return to parallel
        </A>
      </div>

      <div className="text-2xl font-bold">what the heck is this?</div>

      <div className="mt-6">

        <div className="mb-4 ">
          together
        </div>


      </div>

    </div>
  )
}

(ParallelAbout as any).layoutProps = {
  Layout: DefaultLayout,
}

export default ParallelAbout
