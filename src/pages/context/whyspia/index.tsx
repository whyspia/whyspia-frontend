import DefaultLayout from 'components/layouts/DefaultLayout'
import dynamic from 'next/dynamic'

import { type NeedleEngineProps } from 'modules/needle/utils/needleEngine'
const NeedleEngine = dynamic<NeedleEngineProps>(() => import('modules/needle/utils/needleEngine'), { ssr: false })

const WhyspiaPage = () => {


  return (
    <div className="h-screen flex flex-col items-center mt-10">

      <NeedleEngine
        loading-style="dark"
        style={{
          width: '100%',
          height: '100%',
          position: 'fixed',
          top: '0',
          left: '0',
          zIndex: '0'
        }}
        src="/assets/myScene.glb"
      />

      <div className="fixed bottom-20 z-10 flex justify-center items-start w-full">
        <button className="prev m-2.5 bg-black text-3xl rounded-full p-4">👈</button>
        <button className="next m-2.5 bg-black text-3xl rounded-full p-4">👉</button>
      </div>

    </div>
  )
}

(WhyspiaPage as any).layoutProps = {
  Layout: DefaultLayout,
}

export default WhyspiaPage