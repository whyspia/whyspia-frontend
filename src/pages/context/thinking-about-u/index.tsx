import DefaultLayout from 'components/layouts/DefaultLayout'
import toast from 'react-hot-toast'
import { debounce, flatten } from 'lodash'
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/solid"
import { useContext, useState } from 'react'
import { useInfiniteQuery, useQueryClient } from 'react-query'
import { GlobalContext } from 'lib/GlobalContext'
import { twitterLogin } from 'modules/users/services/UserService'
import classNames from 'classnames'
import A from 'components/A'
import ModalService from 'components/modals/ModalService'
import SymbolSelectModal from 'modules/symbol/components/SymbolSelectModal'
import CircleSpinner from 'components/animations/CircleSpinner'
import { apiCreateTAU } from 'actions/tau/apiCreateTAU'
import apiGetAllTAU from 'actions/tau/apiGetAllTAU'

const xUsernamePAttern = /^@?(\w){1,15}$/

const ThinkingAboutUPage = () => {
  const queryClient = useQueryClient()

  const { jwtToken, user } = useContext(GlobalContext)

  const [selectedButton, setSelectedButton] = useState('send')

  const [bAddMessage, setbAddMessage] = useState(false)
  const [additionalMessage, setAdditionalMessage] = useState('')
  const [isTAUSending, setIsTAUSending] = useState(false)

  const fetchSentTAU = async ({ pageParam = 0 }) => {
    const taus = await apiGetAllTAU({ jwt: jwtToken, senderSymbol: user?.twitterUsername, skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' })
    return taus
  }

  const { data: infiniteSentTAUs, fetchNextPage: fetchSentTAUsNextPage, hasNextPage: hasSentTAUsNextPage, isFetchingNextPage: isSentTAUsFetchingNextPage } = useInfiniteQuery(
    [`sent-taus-${user?.twitterUsername}`,],
    ({ pageParam = 0 }) =>
      fetchSentTAU({
        pageParam
      }),
    {
      getNextPageParam: (lastGroup, allGroups) => {
        const morePagesExist = lastGroup?.length === 10

        if (!morePagesExist) {
          return false
        }

        return allGroups.length * 10
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: Boolean(jwtToken),
      keepPreviousData: true,
    }
  )

  const fetchReceivedTAU = async ({ pageParam = 0 }) => {
    const taus = await apiGetAllTAU({ jwt: jwtToken, receiverSymbol: user?.twitterUsername, skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' })
    return taus
  }

  const { data: infiniteReceivedTAUs, fetchNextPage: fetchReceivedTAUsNextPage, hasNextPage: hasReceivedTAUsNextPage, isFetchingNextPage: isReceivedTAUsFetchingNextPage } = useInfiniteQuery(
    [`received-taus-${user?.twitterUsername}`,],
    ({ pageParam = 0 }) =>
      fetchReceivedTAU({
        pageParam
      }),
    {
      getNextPageParam: (lastGroup, allGroups) => {
        const morePagesExist = lastGroup?.length === 10

        if (!morePagesExist) {
          return false
        }

        return allGroups.length * 10
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: Boolean(jwtToken),
      keepPreviousData: true,
    }
  )

  const onDesireClicked = (desire: string) => {
    // window.history.pushState(null, null, `/desire/${desire}`)
    setSelectedButton(desire)
  }

  const [receiverSymbol, setreceiverSymbol] = useState(null)

  const onSetReceiverChanged = debounce(async (username: string) => {
    setreceiverSymbol(username)
    // setIsValid(isExisting)
  }, 500)

  async function handleSendTAU() {
    setIsTAUSending(true)

    const tau = await apiCreateTAU({
      jwt: jwtToken,
      receiverSymbol,
      additionalMessage,
    })
  
    if (tau) {
      console.log('TAU created successfully:', tau)
      toast.success(`sent successfully to ${receiverSymbol}!`)
      queryClient.invalidateQueries([`sent-taus-${user?.twitterUsername}`])
    } else {
      console.error('failed to send TAU')
      toast.success(`failed to send to ${receiverSymbol}!`)
    }

    setIsTAUSending(false)
    setreceiverSymbol(null)
    setAdditionalMessage('')
  }

  const isPossibleXUser = xUsernamePAttern.test(receiverSymbol)
  const isSearchQueryValid = isPossibleXUser 
  const isValid = !isTAUSending && receiverSymbol && receiverSymbol?.length > 0 && (bAddMessage ? additionalMessage?.length > 0 : true) && isSearchQueryValid

  const receivedTAUsData = flatten(infiniteReceivedTAUs?.pages || [])
  const sentTAUsData = flatten(infiniteSentTAUs?.pages || [])

  return (
    <div className="h-screen flex flex-col items-center mt-4">

      <div className="md:w-[36rem] w-full flex flex-col justify-center items-center">

        <div className="text-3xl font-bold mb-8">
          tell someone ur thinking about them or see if anyone is thinking about u
        </div>

        <>
        
          {!user?.twitterUsername ? (
            <>
              <div
                onClick={() => twitterLogin(null)}
                className="relative h-20 flex justify-center items-center px-4 py-2 ml-2 mb-8 text-xs font-bold text-white rounded-xl bg-[#1DA1F2] rounded-xl cursor-pointer"
              >
                connect X
              </div>
            </>
          ): (
            <div className="flex flex-col justify-center items-center">

              <div className="flex items-center space-x-2 mb-2">
                <button
                  onClick={() => onDesireClicked('send')}
                  className={classNames(
                    'relative p-3 mb-4 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer',
                    selectedButton === 'send' ? 'bg-[#1d8f89] selected-tab-triangle' : '',
                  )}
                >
                  send
                </button>

                <button
                  onClick={() => onDesireClicked('sent')}
                  className={classNames(
                    'relative p-3 mb-4 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer',
                    selectedButton === 'sent' ? 'bg-[#1d8f89] selected-tab-triangle' : '',
                  )}
                >
                  sent
                </button>

                <button
                  onClick={() => onDesireClicked('received')}
                  className={classNames(
                    'relative p-3 mb-4 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer',
                    selectedButton === 'received' ? 'bg-[#1d8f89] selected-tab-triangle' : '',
                  )}
                >
                  received
                </button>
              </div>

              {selectedButton === 'send' && (
                <>
                
                  <div className="flex flex-col">
                    <input
                      type="text"
                      placeholder="enter X username... (case matters)"
                      onChange={(event) => onSetReceiverChanged(event.target.value)}
                      className={classNames(
                        isSearchQueryValid ? 'border-[#1d8f89]' : 'border-red-500',
                        "p-4 text-xl border-4 shadow-lg rounded-lg mb-4"
                      )}
                    />

                    {!isSearchQueryValid && (
                      <div className="text-red-500 mb-4">
                        enter a real X username pls
                      </div>
                    )}

                    <div className="flex items-center space-x-2 mb-2">
                      <input
                        type="checkbox"
                        id="pingNow"
                        checked={bAddMessage}
                        onChange={(e) => setbAddMessage(e.target.checked)}
                        className="rounded text-blue-500 "
                      />
                      <label htmlFor="pingNow" className="text-white">add additional message (optional)</label>
                    </div>

                    {bAddMessage && (
                      <div className="mb-2">
                        <textarea
                          placeholder="additional message..."
                          value={additionalMessage}
                          onChange={(e) => setAdditionalMessage(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border rounded-md bg-dark3 text-white"
                        />
                      </div>
                    )}

                    <div className="font-bold text-lg mb-2">PREVIEW:</div>

                    <div className="p-4 border-2 border-white hover:bg-gray-100 hover:bg-opacity-[.1] rounded-2xl">

                      <div className="mb-2">to:{' '}
                        <A
                          onClick={(event) => {
                            event.stopPropagation()
                            ModalService.open(SymbolSelectModal, { symbol: receiverSymbol })
                          }}
                          className="text-blue-500 hover:text-blue-700 cursor-pointer"
                        >{receiverSymbol}</A>
                      </div>

                      <div className="mb-2">im thinking about u and just wanted u to know.</div>

                      {bAddMessage && (
                        <div className="mb-2">
                          {additionalMessage}
                        </div>
                      )}

                      <div className="">~ from{' '}
                        <A
                          onClick={(event) => {
                            event.stopPropagation()
                            ModalService.open(SymbolSelectModal, { symbol: user?.twitterUsername })
                          }}
                          className="text-blue-500 hover:text-blue-700 cursor-pointer"
                        >{user?.twitterUsername}</A>{' '}
                        at {new Date().toLocaleString()}
                      </div>

                    </div>

                    <button
                      onClick={handleSendTAU}
                      className={classNames(
                        `text-white p-4 text-xl shadow-lg rounded-lg mt-4 mb-8`,
                        isValid ? `bg-[#1d8f89] border border-[#1d8f89] hover:border-white cursor-pointer` : `bg-gray-400 border border-gray-400`,
                      )}
                      disabled={!isValid}
                    >
                      send
                    </button>

                    {isTAUSending && <CircleSpinner color="white" bgcolor="#0857e0" />}
                  </div>

                </>
              )}

              {selectedButton === 'sent' && (
                <div className="">
                  
                  {sentTAUsData?.map((sentTAU) => {
                      
                      return (
                        <div key={sentTAU?.id} className="p-4 mb-4 border-2 border-white hover:bg-gray-100 hover:bg-opacity-[.1] rounded-2xl">

                          <div className="mb-2">to:{' '}
                            <A
                              onClick={(event) => {
                                event.stopPropagation()
                                ModalService.open(SymbolSelectModal, { symbol: sentTAU?.receiverSymbol })
                              }}
                              className="text-blue-500 hover:text-blue-700 cursor-pointer"
                            >{sentTAU?.receiverSymbol}</A>
                          </div>

                          <div className="mb-2">im thinking about u and just wanted u to know.</div>

                          {sentTAU?.additionalMessage && sentTAU?.additionalMessage?.length > 0 && (
                            <div className="mb-2">
                              {sentTAU?.additionalMessage}
                            </div>
                          )}

                          <div className="">~ from{' '}
                            <A
                              onClick={(event) => {
                                event.stopPropagation()
                                ModalService.open(SymbolSelectModal, { symbol: sentTAU?.senderSymbol })
                              }}
                              className="text-blue-500 hover:text-blue-700 cursor-pointer"
                            >{sentTAU?.senderSymbol}</A>{' '}
                            at {new Date(sentTAU?.createdAt).toLocaleString()}
                          </div>

                        </div>
                      )
                  })}

                  {hasSentTAUsNextPage && <button onClick={() => fetchSentTAUsNextPage()} disabled={!hasSentTAUsNextPage || isSentTAUsFetchingNextPage}>
                    {isSentTAUsFetchingNextPage ? 'Loading...' : 'Load More'}
                  </button>}
                </div>
              )}

              {selectedButton === 'received' && (
                <div className="">

                  {receivedTAUsData?.map((receivedTAU) => {
                      
                      return (
                        <div key={receivedTAU?.id} className="p-4 mb-4 border-2 border-white hover:bg-gray-100 hover:bg-opacity-[.1] rounded-2xl">

                          <div className="mb-2">to:{' '}
                            <A
                              onClick={(event) => {
                                event.stopPropagation()
                                ModalService.open(SymbolSelectModal, { symbol: receivedTAU?.receiverSymbol })
                              }}
                              className="text-blue-500 hover:text-blue-700 cursor-pointer"
                            >{receivedTAU?.receiverSymbol}</A>
                          </div>

                          <div className="mb-2">im thinking about u and just wanted u to know.</div>

                          {receivedTAU?.additionalMessage && receivedTAU?.additionalMessage?.length > 0 && (
                            <div className="mb-2">
                              {receivedTAU?.additionalMessage}
                            </div>
                          )}

                          <div className="">~ from{' '}
                            <A
                              onClick={(event) => {
                                event.stopPropagation()
                                ModalService.open(SymbolSelectModal, { symbol: receivedTAU?.senderSymbol })
                              }}
                              className="text-blue-500 hover:text-blue-700 cursor-pointer"
                            >{receivedTAU?.senderSymbol}</A>{' '}
                            at {new Date(receivedTAU?.createdAt).toLocaleString()}
                          </div>

                        </div>
                      )
                  })}

                  {hasReceivedTAUsNextPage && <button onClick={() => fetchReceivedTAUsNextPage()} disabled={!hasReceivedTAUsNextPage || isReceivedTAUsFetchingNextPage}>
                    {isReceivedTAUsFetchingNextPage ? 'Loading...' : 'Load More'}
                  </button>}
                </div>
              )}

            </div>
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