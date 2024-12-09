import DefaultLayout from 'components/layouts/DefaultLayout'
import type { NextPage } from 'next'
import HomeReusable from 'modules/no-category/components/HomeReusable'
import { useContext, useEffect } from 'react'
import ModalService from 'components/modals/ModalService'
// import SendEmoteModal from 'modules/symbol/components/SendEmoteModal'
import { GlobalContext } from 'lib/GlobalContext'

const Desire: NextPage = () => {
  const { isModalServiceLoaded } = useContext(GlobalContext)

  useEffect(() => {
    // ModalService.open(SendEmoteModal, { }, () => window.history.pushState(null, null, '/'))
  }, [isModalServiceLoaded])

  return (
    <HomeReusable />
  )
}

(Desire as any).layoutProps = {
  Layout: DefaultLayout,
}

export default Desire
