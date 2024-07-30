import DefaultLayout from 'components/layouts/DefaultLayout'
import type { NextPage } from 'next'
import A from 'components/A'
import ModalService from 'components/modals/ModalService'
import SendEmoteModal from 'modules/symbol/components/SendEmoteModal'
import { useRouter } from 'next/router'

const HomeReusable: NextPage = () => {
  const router = useRouter()

  const onDesireClicked = (desire: string) => {
    router.push(`${router.pathname}`, `/desire/${desire}`, { shallow: true })
    ModalService.open(SendEmoteModal, { initialDesire: desire, }, () => window.history.pushState(null, null, '/'))
  }

  return (
    <div className="text-center px-4 relative z-40">

      <div className="text-2xl font-bold">why are you here? what do you desire?</div>

      <div className="flex flex-wrap justify-center mt-6">

        <A
          className="p-3 mb-4 mr-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 cursor-pointer"
          onClick={() => onDesireClicked('context')}
        >
          go to context
        </A>

        {/* <A
          className="p-3 mb-4 mr-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 cursor-pointer"
          onClick={() => onDesireClicked('send')}
        >
          send symbol
        </A>

        <A
          // href="/all"
          className="p-3 mb-4 mr-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 cursor-pointer"
          onClick={() => onDesireClicked('define')}
        >
          define symbol
        </A> */}

        {/* <A
          href={`/desire/search`}
          className="p-3 mb-4 mr-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 cursor-pointer"
        >
          search symbols or users
        </A> */}

        <A
          href={`/desire/about`}
          className="p-3 mb-4 mr-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 cursor-pointer"
        >
          about
        </A>

      </div>

    </div>
  )
}

(HomeReusable as any).layoutProps = {
  Layout: DefaultLayout,
}

export default HomeReusable
