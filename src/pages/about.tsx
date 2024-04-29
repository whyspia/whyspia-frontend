import DefaultLayout from 'components/layouts/DefaultLayout'
import type { NextPage } from 'next'

const AboutHome: NextPage = () => {

  return (
    <div className="text-center px-4 relative z-40">

      <div className="text-2xl font-bold">what the heck is this?</div>

      <div className="mt-6">

        <div className="mb-4 ">
          1) send symbols
          2) define symbols
        </div>

        <div>a symbol is anything you can input (like the text "hug" which allow you to send a virtual hug)</div>

      </div>

    </div>
  )
}

(AboutHome as any).layoutProps = {
  Layout: DefaultLayout,
}

export default AboutHome
