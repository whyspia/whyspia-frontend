"use client"

import toast from 'react-hot-toast'
import { flatten } from 'lodash'
import { useContext, useState } from 'react'
import { useInfiniteQuery, useQueryClient } from 'react-query'
import { GlobalContext } from 'lib/GlobalContext'
import classNames from 'classnames'
import A from 'components/A'
import ModalService from 'components/modals/ModalService'
import SymbolSelectModal from 'modules/symbol/components/SymbolSelectModal'
import CircleSpinner from 'components/animations/CircleSpinner'
import { apiCreateTAU } from 'actions/tau/apiCreateTAU'
import apiGetAllTAU from 'actions/tau/apiGetAllTAU'
import ChoosePersonModal from 'modules/users/components/ChoosePersonModal'
import useAuth from 'modules/users/hooks/useAuth'
import PersonClickModal from 'modules/users/components/PersonClickModal'

const ThinkingAboutUPage = () => {
  const queryClient = useQueryClient()

  const { jwtToken, userV2: loggedInUser } = useContext(GlobalContext)

  const [selectedButton, setSelectedButton] = useState('send')

  const [bAddMessage, setbAddMessage] = useState(false)
  const [additionalMessage, setAdditionalMessage] = useState('')
  const [isTAUSending, setIsTAUSending] = useState(false)

  const { handleParticleAndWhyspiaLogin } = useAuth()

  const fetchSentTAU = async ({ pageParam = 0 }) => {
    const taus = await apiGetAllTAU({ jwt: jwtToken, senderPrimaryWallet: loggedInUser?.primaryWallet as string, skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' })
    return taus
  }

  const { data: infiniteSentTAUs, fetchNextPage: fetchSentTAUsNextPage, hasNextPage: hasSentTAUsNextPage, isFetchingNextPage: isSentTAUsFetchingNextPage } = useInfiniteQuery(
    [`sent-taus-${loggedInUser?.primaryWallet}`,],
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
    const taus = await apiGetAllTAU({ jwt: jwtToken, receiverPrimaryWallet: loggedInUser?.primaryWallet, skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' })
    return taus
  }

  const { data: infiniteReceivedTAUs, fetchNextPage: fetchReceivedTAUsNextPage, hasNextPage: hasReceivedTAUsNextPage, isFetchingNextPage: isReceivedTAUsFetchingNextPage } = useInfiniteQuery(
    [`received-taus-${loggedInUser?.primaryWallet}`,],
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

  const [selectedPerson, setSelectedPerson] = useState<{ calculatedDisplayName: string, chosenName: string, primaryWalletSaved: string } | null>(null)

  const setNewSelectedPerson = (newSelectedPerson: { calculatedDisplayName: string, chosenName: string, primaryWalletSaved: string }) => {
    if (newSelectedPerson) {
      setSelectedPerson(newSelectedPerson)
    }
  }

  async function handleSendTAU() {
    setIsTAUSending(true)

    const tau = await apiCreateTAU({
      jwt: jwtToken,
      receiverPrimaryWallet: selectedPerson.primaryWalletSaved,
      additionalMessage,
    })

    const displayedName = selectedPerson.calculatedDisplayName ?? selectedPerson.primaryWalletSaved
  
    if (tau) {
      console.log('TAU created successfully:', tau)
      toast.success(`sent successfully to ${displayedName}!`)
      queryClient.invalidateQueries([`sent-taus-${loggedInUser?.primaryWallet}`])
    } else {
      console.error('failed to send TAU')
      toast.success(`failed to send to ${displayedName}!`)
    }

    setIsTAUSending(false)
    setSelectedPerson(null)
    setAdditionalMessage('')
  }

  const isValid = !isTAUSending && selectedPerson && selectedPerson?.primaryWalletSaved?.length > 0 && (bAddMessage ? additionalMessage?.length > 0 : true)

  const receivedTAUsData = flatten(infiniteReceivedTAUs?.pages || [])
  const sentTAUsData = flatten(infiniteSentTAUs?.pages || [])

  const selectedPersonDisplayedName = selectedPerson?.calculatedDisplayName ?? selectedPerson?.primaryWalletSaved
  const loggedInUserDisplayedName = loggedInUser?.chosenPublicName ?? loggedInUser?.primaryWallet

  return (
    <div className="h-screen flex flex-col items-center mt-4 px-4">

      <div className="md:w-[36rem] w-full flex flex-col justify-center items-center">

        <div className="text-3xl font-bold mb-8">
          tell someone ur thinking about them or see if anyone is thinking about u
        </div>

        <>
        
          {!jwtToken ? (
            <>
              <div
                onClick={handleParticleAndWhyspiaLogin}
                className="relative h-20 flex justify-center items-center px-4 py-2 ml-2 mb-8 text-xs font-bold text-white rounded-xl bg-[#1DA1F2] rounded-xl cursor-pointer"
              >
                login
              </div>
            </>
          ): (
            <div className="w-full flex flex-col justify-center items-center">

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
                
                  <div className="w-full flex flex-col">
                    <button
                      onClick={() => ModalService.open(ChoosePersonModal, { setNewSelectedPerson }) }
                      className={classNames(
                        "p-4 text-xl text-left border-4",
                        selectedPerson ? "border-[#1d8f89]" : "border-red-500",
                        "shadow-lg rounded-lg mb-4 cursor-pointer"
                      )}
                    >
                      {selectedPerson ? (
                        <>
                          <div className="opacity-[50%] mb-2">change person to interact with...</div>
                          <div className="p-3 rounded-lg bg-[#3a3a3a]">
                            {selectedPerson.calculatedDisplayName && (<strong>{selectedPerson.calculatedDisplayName}</strong>)}
                            <div>{selectedPerson.primaryWalletSaved}</div>
                          </div>
                        </>
                      ) : (
                        <span className="opacity-[50%]">select person to interact with...</span>
                      )}
                    </button>

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

                    <div className="p-6 border-2 border-white hover:bg-gray-100 hover:bg-opacity-[.1] rounded-2xl">

                      <div className="mb-4 ">to:{' '}
                        <A
                          onClick={(event) => {
                            event.stopPropagation()
                            ModalService.open(PersonClickModal, { userToken: selectedPerson })
                          }}
                          className="text-blue-500 hover:text-blue-700 cursor-pointer"
                        >{selectedPersonDisplayedName}</A>
                      </div>

                      <div className="mb-4 text-[#1d8f89] italic">im thinking about u and just wanted u to know.</div>

                      {bAddMessage && (
                        <div className="mb-4 whitespace-pre-wrap break-words leading-5 italic">
                          {additionalMessage}
                        </div>
                      )}

                      <div className="">~ from{' '}
                        <A
                          onClick={(event) => {
                            event.stopPropagation()
                            ModalService.open(PersonClickModal, { userToken: loggedInUser })
                          }}
                          className="text-blue-500 hover:text-blue-700 cursor-pointer"
                        >{loggedInUserDisplayedName}</A>{' '}
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
                        <div key={sentTAU?.id} className="p-6 mb-4 border-2 border-white hover:bg-gray-100 hover:bg-opacity-[.1] rounded-2xl">

                          <div className="mb-4 ">to:{' '}
                            <A
                              onClick={(event) => {
                                event.stopPropagation()
                                ModalService.open(PersonClickModal, { userToken: sentTAU?.receiverUser })
                              }}
                              className="text-blue-500 hover:text-blue-700 cursor-pointer"
                            >{sentTAU?.receiverUser?.calculatedDisplayName}</A>
                          </div>

                          <div className="mb-4 text-[#1d8f89] italic">im thinking about u and just wanted u to know.</div>

                          {sentTAU?.additionalMessage && sentTAU?.additionalMessage?.length > 0 && (
                            <div className="mb-4 whitespace-pre-wrap break-words leading-5 italic">
                              {sentTAU?.additionalMessage}
                            </div>
                          )}

                          <div className="">~ from{' '}
                            <A
                              onClick={(event) => {
                                event.stopPropagation()
                                ModalService.open(PersonClickModal, { userToken: sentTAU?.senderUser })
                              }}
                              className="text-blue-500 hover:text-blue-700 cursor-pointer"
                            >{sentTAU?.senderUser?.calculatedDisplayName}</A>{' '}
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
                        <div key={receivedTAU?.id} className="p-6 mb-4 border-2 border-white hover:bg-gray-100 hover:bg-opacity-[.1] rounded-2xl">

                          <div className="mb-4 ">to:{' '}
                            <A
                              onClick={(event) => {
                                event.stopPropagation()
                                ModalService.open(PersonClickModal, { userToken: receivedTAU?.receiverUser })
                              }}
                              className="text-blue-500 hover:text-blue-700 cursor-pointer"
                            >{receivedTAU?.receiverUser?.calculatedDisplayName}</A>
                          </div>

                          <div className="mb-4 text-[#1d8f89] italic">im thinking about u and just wanted u to know.</div>

                          {receivedTAU?.additionalMessage && receivedTAU?.additionalMessage?.length > 0 && (
                            <div className="mb-4 whitespace-pre-wrap break-words leading-5 italic">
                              {receivedTAU?.additionalMessage}
                            </div>
                          )}

                          <div className="">~ from{' '}
                            <A
                              onClick={(event) => {
                                event.stopPropagation()
                                ModalService.open(PersonClickModal, { userToken: receivedTAU?.senderUser })
                              }}
                              className="text-blue-500 hover:text-blue-700 cursor-pointer"
                            >{receivedTAU?.senderUser?.calculatedDisplayName}</A>{' '}
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

export default ThinkingAboutUPage