import DefaultLayout from 'components/layouts/DefaultLayout'
import { useContext, useEffect, useState } from 'react'
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/solid"
import toast from 'react-hot-toast'
import { GlobalContext } from 'lib/GlobalContext'
import DropdownSelectMenu from 'modules/forms/components/DropdownSelectMenu'
import { EMOTE_CONTEXTS } from 'modules/context/utils/ContextUtils'
import { twitterLogin } from 'modules/users/services/UserService'
import ModalService from 'components/modals/ModalService'
import ParallelGoOnlineModal from 'modules/contexts/parallel/components/ParallelGoOnlineModal'
import useSocketio from 'modules/no-category/hooks/useSocketio'
import { apiNewEmote } from 'actions/emotes/apiCreateEmote'
import { apiNewEmotesMany } from 'actions/emotes/apiCreateEmotesMany'
import ParallelHelpRequestModal from 'modules/contexts/parallel/components/ParallelHelpRequestModal'


const ParallelContexts = [
  EMOTE_CONTEXTS.NO_CONTEXT,
  EMOTE_CONTEXTS.VIBE_CAFE,
  EMOTE_CONTEXTS.VIBE_CAMP,
  EMOTE_CONTEXTS.AKIYA_COLLECTIVE,
]

enum PARALLEL_USER_PATHS {
  HELP_BOARD = 'help board',
  HELPERS = 'helpers',
  JOINABLE = 'joinable people',
  ALL_PEOPLE = 'all people in this context',
  YOU = 'YOU',
}
const ParallelUserPaths = [
  PARALLEL_USER_PATHS.HELP_BOARD,
  PARALLEL_USER_PATHS.HELPERS,
  PARALLEL_USER_PATHS.JOINABLE,
  PARALLEL_USER_PATHS.ALL_PEOPLE,
  PARALLEL_USER_PATHS.YOU,
]

const ParallelPage = () => {
  const { jwtToken, user } = useContext(GlobalContext)

  const [selectedContext, setSelectedContext] = useState(EMOTE_CONTEXTS.NO_CONTEXT as string)
  const [selectedPath, setSelectedPath] = useState(PARALLEL_USER_PATHS.HELP_BOARD as string)
  const [isOnline, setIsOnline] = useState(false) // isOnline true basically means user sent emote to say they are online

  const { isSocketioConnected } = useSocketio(isOnline)

  const [isPreviewDropdownOpen, setIsPreviewDropdownOpen] = useState(false)

  useEffect(() => {
    if (!jwtToken) {
      setIsOnline(false)
    }
  }, [jwtToken])

  const onSelectContext = async (newContext: EMOTE_CONTEXTS) => {
    // try {
      
    // } catch (error) {
    //   console.error("for some reason, could not send emote(s) to enter/exit context", error)
    //   return null
    // }

    if (selectedContext === EMOTE_CONTEXTS.NO_CONTEXT) {
      // if starting with no context, then dont need exit emote
      const emote = await apiNewEmote({
        jwt: jwtToken,
        receiverSymbols: [newContext],
        sentSymbols: ['entered'],
      })
    
      if (emote) {
        console.log('emote to enter context created successfully:', emote)
        toast.success(`"entered" has been sent to ${newContext}!`)
      } else {
        console.error('failed to create emote to enter context')
        return false
      }
    } else {
      // if going back to no context, then we only need emote for exiting. Otherwise, need both enter emote and exit emote
      
      if (newContext === EMOTE_CONTEXTS.NO_CONTEXT) {
        const emote = await apiNewEmote({
          jwt: jwtToken,
          receiverSymbols: [selectedContext],
          sentSymbols: ['exited'],
        })
      
        if (emote) {
          console.log('emote to exit context created successfully:', emote)
          toast.success(`"exited" has been sent to ${selectedContext}!`)
        } else {
          console.error('failed to create emote to exit context')
          return false
        }
      } else {
        const enterEmote = {
          jwt: jwtToken,
          receiverSymbols: [newContext],
          sentSymbols: ['entered'],
        }
        const exitEmote = {
          jwt: jwtToken,
          receiverSymbols: [selectedContext],
          sentSymbols: ['exited'],
        }
        const emotes = [exitEmote, enterEmote]

        const responseEmotes = await apiNewEmotesMany({
          jwt: jwtToken,
          emotes
        })
    
        if (responseEmotes) {
          console.log('emotes created successfully for exit and enter:', responseEmotes)
          toast.success(`"entered" has been sent to ${newContext}!`)
          toast.success(`"exited" has been sent to ${selectedContext}!`)
        } else {
          console.error('failed to create emotes for exit and enter')
          return false
        }
      }

    }


    setSelectedContext(newContext)
  }


  return (
    <div className="h-screen flex flex-col items-center mt-10">

      <>
        <h1 className="text-4xl font-bold mb-8">
          parallel
        </h1>

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

            {!isOnline ? (
              <>
                <div
                  onClick={() => ModalService.open(ParallelGoOnlineModal, { onGoOnlineSuccess: () => setIsOnline(true) })}
                  className="relative h-20 flex justify-center items-center px-4 py-2 ml-2 mb-8 text-xs font-bold text-white rounded-xl bg-[#1DA1F2] rounded-xl cursor-pointer"
                >
                  go online
                </div>
              </>
            ): (
              <>

                <>

                  <div className="md:w-1/2 w-full flex justify-between">

                    <div>
                      <div className="font-bold text-lg mb-1">choose context:</div>

                      <DropdownSelectMenu
                        options={ParallelContexts}
                        selectedOption={selectedContext}
                        setSelectedOption={onSelectContext}
                      />
                    </div>

                    <div>
                      <div className="font-bold text-lg mb-1">choose user path:</div>

                      <DropdownSelectMenu
                        options={ParallelUserPaths}
                        selectedOption={selectedPath}
                        setSelectedOption={setSelectedPath}
                      />
                    </div>

                  </div>

                  {selectedContext === EMOTE_CONTEXTS.NO_CONTEXT ? (
                    <div className="border-t border-white w-full mt-4 pt-4 flex justify-center">
                      no context chosen yet...CHOOSE ONE
                    </div>
                  ): (
                    <div className="border-t border-white w-full mt-4 pt-4 flex justify-center">
                      {/* based on user path selected, show a different UX */}
                      {selectedPath === PARALLEL_USER_PATHS.HELP_BOARD && (
                        <div className="flex items-center flex-col">
                          <div className="text-2xl font-bold">help board</div>
                          
                          <div
                            onClick={(event) => {
                              event.stopPropagation()
                              setIsPreviewDropdownOpen(!isPreviewDropdownOpen)
                            }}
                            className="flex items-center mt-4 mb-2 py-2 px-4 rounded-md bg-purple-500 border border-purple-500 hover:border-white w-full cursor-pointer"
                          >
                            <div className="font-bold text-lg mb-1">two main options here</div>
                            {isPreviewDropdownOpen ? (
                              <ChevronUpIcon className="w-5 h-5" />
                            ) : (
                              <ChevronDownIcon className="w-5 h-5" />
                            )}
                          </div>

                          {isPreviewDropdownOpen && (
                            <ul className="ml-10 list-disc">
                              <li
                                onClick={() => ModalService.open(ParallelHelpRequestModal, { chosenContext: selectedContext })}
                                className="text-blue-500 hover:underline cursor-pointer"
                              >
                                post things you need help with OR desires
                              </li>
                              <li>read posts and help people</li>
                            </ul>
                          )}

                        </div>
                      )}
                      {selectedPath === PARALLEL_USER_PATHS.HELPERS && (
                        <div>
                          helpers
                        </div>
                      )}
                      {selectedPath === PARALLEL_USER_PATHS.JOINABLE && (
                        <div>
                          joinable people
                        </div>
                      )}
                      {selectedPath === PARALLEL_USER_PATHS.ALL_PEOPLE && (
                        <div>
                          all people
                        </div>
                      )}
                      {selectedPath === PARALLEL_USER_PATHS.YOU && (
                        <div>
                          you
                        </div>
                      )}

                    </div>
                  )}

                </>

              </>
            )}
            

          </>
        )}

      </>
    </div>
  )
}

(ParallelPage as any).layoutProps = {
  Layout: DefaultLayout,
}

export default ParallelPage