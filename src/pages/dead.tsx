import DefaultLayout from 'components/layouts/DefaultLayout'
import type { NextPage } from 'next'

const DeadPage: NextPage = () => {

  return (
    <div className="md:w-1/2 w-full mx-auto relative z-40">

      <div className="text-2xl font-bold text-center mb-2">we are dead rn - srry - be back soon...we hope</div>
      <div className="text-lg font-bold text-center">shmoji&apos;s predicted downtime: 8/28/2024 5pm EST to 8/29/2024 5pm EST</div>


    </div>
  )
}

(DeadPage as any).layoutProps = {
  Layout: DefaultLayout,
}

export default DeadPage
