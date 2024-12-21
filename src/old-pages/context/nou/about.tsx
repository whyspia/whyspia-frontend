import classNames from 'classnames'
import A from 'components/A'
import DefaultLayout from 'components/layouts/DefaultLayout'
import type { NextPage } from 'next'

const NoUAbout: NextPage = () => {

  return (
    <div className="text-center px-4 relative z-40">

      <div className="my-6 ">
        <A
          href={`/place/nou`}
          className={classNames(
            'p-3 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer'
          )}
        >
          return to No U
        </A>
      </div>

      <div className="text-2xl font-bold">what the heck is this?</div>

      <div className="mt-6">

        <div className="mb-4 ">
          1) send symbols
          2) receive symbols
          3) emote back to received symbols
          4) create chains of emotes and see how long you can keep a streak
        </div>

        <div>a symbol is anything you can input (like the text &quot;hug&quot; which allows you to send a virtual hug)</div>

      </div>

    </div>
  )
}

(NoUAbout as any).layoutProps = {
  Layout: DefaultLayout,
}

export default NoUAbout
