import DefaultLayout from 'components/layouts/DefaultLayout'
import toast from 'react-hot-toast'
import { flatten } from 'lodash'
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/solid"
import { useContext, useState } from 'react'
import { useInfiniteQuery, useQueryClient } from 'react-query'
import { GlobalContext } from 'lib/GlobalContext'
import { twitterLogin } from 'modules/users/services/UserService'
import classNames from 'classnames'
import { EMOTE_CONTEXTS } from 'modules/context/utils/ContextUtils'
import { SentEmoteBlock } from 'modules/symbol/components/SentEmoteBlock'

const ThinkingAboutUPage = () => {
  const queryClient = useQueryClient()

  const { jwtToken, user } = useContext(GlobalContext)

  return (
    <div className="h-screen flex flex-col items-center mt-10">

      <div className="md:w-[36rem] w-full flex flex-col justify-center items-center">

        <h1 className="text-4xl font-bold mb-8">
          tell someone ur thinking about them or see if anyone is thinking about u
        </h1>

        <>
        
          {!user?.twitterUsername ? (
            <>
              <div
                onClick={() => twitterLogin(null)}
                className="relative h-20 flex justify-center items-center px-4 py-2 ml-2 mb-8 text-xs font-bold text-white rounded-xl bg-[#1DA1F2] rounded-xl"
              >
                connect X
              </div>
            </>
          ): (
            <>

              

              
            </>
          )}

          
        </>

      </div>
    </div>
  )
}

(ThinkingAboutUPage as any).layoutProps = {
  Layout: DefaultLayout,
}

export default ThinkingAboutUPage