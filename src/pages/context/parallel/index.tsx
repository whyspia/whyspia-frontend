import DefaultLayout from 'components/layouts/DefaultLayout'
import { useContext, useState } from 'react'
import { useQueryClient } from 'react-query'
import { GlobalContext } from 'lib/GlobalContext'
import DropdownSelectMenu from 'modules/forms/components/DropdownSelectMenu'
import { EMOTE_CONTEXTS } from 'modules/context/utils/ContextUtils'

const ParallelContexts = [
  EMOTE_CONTEXTS.NO_CONTEXT,
  EMOTE_CONTEXTS.VIBE_CAFE,
  EMOTE_CONTEXTS.VIBE_CAMP,
  EMOTE_CONTEXTS.AKIYA_COLLECTIVE,
]

const PARALLEL_USER_PATHS = [
  'help board',
  'helpers',
  'joinable people',
  'all people in this context',
  'YOU',
]

const ParallelPage = () => {
  const queryClient = useQueryClient()

  const { jwtToken, user } = useContext(GlobalContext)

  const [selectedContext, setSelectedContext] = useState(EMOTE_CONTEXTS.NO_CONTEXT as string)
  const [selectedPath, setSelectedPath] = useState('help board')


  return (
    <div className="h-screen flex flex-col items-center mt-10">

      <>
        <h1 className="text-4xl font-bold mb-8">
          parallel
        </h1>

        <>

          <div className="md:w-1/2 w-full flex justify-between">

            <div>
              <div className="font-bold text-lg mb-1">choose context:</div>

              <DropdownSelectMenu
                options={ParallelContexts}
                selectedOption={selectedContext}
                setSelectedOption={setSelectedContext}
              />
            </div>

            <div>
              <div className="font-bold text-lg mb-1">choose user path:</div>

              <DropdownSelectMenu
                options={PARALLEL_USER_PATHS}
                selectedOption={selectedPath}
                setSelectedOption={setSelectedPath}
              />
            </div>

          </div>
        
          {/* {!user?.twitterUsername ? (
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

              <input placeholder="enter message for nana..." value={selectedSymbol} onChange={(event) => setSelectedSymbol(event.target.value)} className="p-4 text-xl border-yellow-500 border-4 shadow-lg rounded-lg mb-8" />
              
              <button
                onClick={handleSendMessage}
                className={classNames(
                  `text-white p-4 text-xl shadow-lg rounded-lg mb-8`,
                  isValid ? `bg-yellow-500 cursor-pointer` : `bg-yellow-400`,
                )}
                disabled={!isValid}
              >
                send
              </button>

              
            </>
          )} */}

          
        </>

      </>
    </div>
  )
}

(ParallelPage as any).layoutProps = {
  Layout: DefaultLayout,
}

export default ParallelPage