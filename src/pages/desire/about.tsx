import DefaultLayout from 'components/layouts/DefaultLayout'
import type { NextPage } from 'next'

const About: NextPage = () => {

  return (
    <div className="text-center px-4 relative z-40">

      <div className="text-2xl font-bold">What the heck is this?</div>

      <div className="mt-6">

        <div className="mb-4 ">
          1) send symbols
          2) define symbols
        </div>

        <div>A symbol is anything you can input (like the text "hug" which allow you to send a virtual hug)</div>

      </div>

    </div>
  )
}

(About as any).layoutProps = {
  Layout: DefaultLayout,
}

export default About
