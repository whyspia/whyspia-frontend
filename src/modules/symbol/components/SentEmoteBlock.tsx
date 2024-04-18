import { EmoteResponse } from "actions/notifs/apiGetAllEmoteNotifs"
import A from "components/A"
import { useEffect, useRef, useState } from "react"
import { formatTimeAgo } from "utils/randomUtils"
import { DotsHorizontalIcon, ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/solid"
import ModalService from "components/modals/ModalService"
import SymbolSelectModal from "./SymbolSelectModal"
import toast from 'react-hot-toast'
import copy from 'copy-to-clipboard'
import { getFrontendURL } from "utils/seo-constants"
import { useRouter } from "next/router"
import NouEmoteModal from "./NouEmoteModal"
import SendEmoteModal from "./SendEmoteModal"
import classNames from "classnames"


export const SentEmoteBlock = ({
  emote,
  jwt,
  isPersonal = false, // is visuals of this Emote being displayed FOR logged in user. If so, can use language like "you"
  isPreview = false,  // is this a preview - so an emote that has not been sent yet
  context = '',     // sometimes the context changes code in this file
}: {
  emote: EmoteResponse
  jwt?: string
  isPersonal?: boolean
  isPreview?: boolean
  context?: string
}) => {
  const router = useRouter()
  const receiverSymbolsCount = emote?.receiverSymbols?.length || 0
  const sentSymbolsCount = emote?.sentSymbols?.length || 0
  const isMultipleReceivers = receiverSymbolsCount > 1
  const isMultipleSentSymbols = sentSymbolsCount > 1

  const [showDetails, setShowDetails] = useState(false)

  const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false)
  const [isToDropdownOpen, setIsToDropdownOpen] = useState(false)
  const [isSentSymbolsDropdownOpen, setIsSentSymbolsDropdownOpen] = useState(false)

  const [optionsTooltipVisibility, setOptionsTooltipVisibility] = useState(false)
  const optionsRef = useRef(null)

  const [sentSymbolsTooltipVisibility, setSentSymbolsTooltipVisibility] = useState(false)
  const sentSymbolsRef = useRef(null)

  const [receiversTooltipVisibility, setReceiversTooltipVisibility] = useState(false)
  const receiversRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setOptionsTooltipVisibility(false)
      } else {
        setOptionsTooltipVisibility(true)
      }
    }
  
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sentSymbolsRef.current && !sentSymbolsRef.current.contains(event.target)) {
        setSentSymbolsTooltipVisibility(false)
      } else {
        setSentSymbolsTooltipVisibility(true)
      }
    }
  
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (receiversRef.current && !receiversRef.current.contains(event.target)) {
        setReceiversTooltipVisibility(false)
      } else {
        setReceiversTooltipVisibility(true)
      }
    }
  
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const onShowDetailsChanged = (isDetailsShown: boolean) => {
    setShowDetails(isDetailsShown)
  }

  const copyEmotePageURL = (event) => {
    event?.stopPropagation()
    const url = `${getFrontendURL()}/emote/${emote?.id}`
    copy(url)
    toast.success('Copied emote page URL')
  }

  const isFullWidth = isPreview

  return (
    <div
      onClick={(event) => {
        if (!isPreview) {
          router.push(`/emote/${emote?.id}`)
        }
      }}
      className={classNames(
        isFullWidth ? 'w-full' : 'md:w-1/2 w-full ',
        showDetails ? 'items-start' : 'items-center', // this is basically for keeping emote button at top when showing details. and items-center is needed when not showing details bc it centers all the text of emote and emote button
        "relative text-lg p-4 md:pl-12 border border-white hover:bg-gray-100 hover:bg-opacity-[.1] flex cursor-pointer"
      )}
    >

      {showDetails ? (
        <div className="">

          <div>
            <A
              onClick={(event) => {
                event.stopPropagation()
                ModalService.open(SymbolSelectModal, { symbol: emote?.senderTwitterUsername })
              }}
              className="text-blue-500 hover:text-blue-700 cursor-pointer"
            >
              {emote?.senderTwitterUsername}
            </A> sent{' '}

            {isMultipleSentSymbols ? (
              <span
                ref={sentSymbolsRef}
                onClick={(event) => event.stopPropagation()}
                className="relative rounded-full inline-flex justify-center items-center cursor-pointer"
              >
                <span className="text-red-500 hover:text-red-700 cursor-pointer">{sentSymbolsCount} symbols</span>

                {sentSymbolsTooltipVisibility && (
                  <div
                    onClick={(event) => {
                      event.stopPropagation()
                      setSentSymbolsTooltipVisibility(false)
                    }}
                    className="absolute z-[600] h-[6rem] w-[10rem] inset-y-0 right-0 top-full text-sm text-black rounded-xl shadow bg-white overflow-auto"
                  >
                    <div className="flex flex-col w-full text-black font-semibold">
                      <div
                        onClick={(event) => {{
                          event.stopPropagation()
                          onShowDetailsChanged(!showDetails)
                        }}}
                        className="px-2 py-2 border-b flex items-center cursor-pointer hover:bg-gray-200 hover:bg-opacity-50"
                      >
                        <span>toggle details</span>
                      </div>

                    </div>
                  </div>
                )}

              </span>
            ): (
              <A
                onClick={(event) => {
                  event.stopPropagation()
                  ModalService.open(SymbolSelectModal, { symbol: emote?.sentSymbols[0] })
                }}
                className="text-red-500 hover:text-red-700 cursor-pointer"
              >
                {emote?.sentSymbols[0]}
              </A>
            )} to{' '}

            {isMultipleReceivers ? (
              <span
                ref={receiversRef}
                onClick={(event) => event.stopPropagation()}
                className="relative rounded-full inline-flex justify-center items-center cursor-pointer"
              >
                {isPersonal ? (
                  <span className="text-red-500 hover:text-red-700 cursor-pointer">you and {receiverSymbolsCount - 1} others</span>
                ): (
                  <span className="text-red-500 hover:text-red-700 cursor-pointer">{receiverSymbolsCount} receivers</span>
                )}

                {receiversTooltipVisibility && (
                  <div
                    onClick={(event) => {
                      event.stopPropagation()
                      setReceiversTooltipVisibility(false)
                    }}
                    className="absolute z-[600] h-[6rem] w-[10rem] inset-y-0 right-0 top-full text-sm text-black rounded-xl shadow bg-white overflow-auto"
                  >
                    <div className="flex flex-col w-full text-black font-semibold">
                      <div
                        onClick={(event) => {{
                          event.stopPropagation()
                          onShowDetailsChanged(!showDetails)
                        }}}
                        className="px-2 py-2 border-b flex items-center cursor-pointer hover:bg-gray-200 hover:bg-opacity-50"
                      >
                        <span>toggle details</span>
                      </div>

                    </div>
                  </div>
                )}

              </span>
            ): (
              <>
                {isPersonal ? (
                  <span className="text-red-500 hover:text-red-700 cursor-pointer">you</span>
                ): (
                  <A
                    onClick={(event) => {
                      event.stopPropagation()
                      ModalService.open(SymbolSelectModal, { symbol: emote?.receiverSymbols[0] })
                    }}
                    className="text-blue-500 hover:text-blue-700 cursor-pointer"
                  >
                    {emote?.receiverSymbols[0]}
                  </A>
                )}
              </>
            )} - {isPreview ? '1 minute ago' : formatTimeAgo(emote?.timestamp)}

          </div>

          <div className="mt-3">

            <button
              onClick={(event) => {
                event.stopPropagation()
                setIsFromDropdownOpen(!isFromDropdownOpen)
              }}
              className="flex items-center py-2 px-4 rounded-md bg-[#374151] border border-[#374151] hover:border-white w-full"
            >
              <div>FROM:</div>
              {isFromDropdownOpen ? (
                <ChevronUpIcon className="w-5 h-5 ml-2" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 ml-2" />
              )}
            </button>

            {isFromDropdownOpen && (
              <ul className="ml-10 list-disc">
                <li><A href={`/u/${emote?.senderTwitterUsername}`} onClick={(event) => event.stopPropagation()} className="text-blue-500 hover:text-blue-700 cursor-pointer">
                  {emote?.senderTwitterUsername}
                </A></li>
              </ul>
            )}

          </div>

          <div className="mt-3">

            <button
              onClick={(event) => {
                event.stopPropagation()
                setIsToDropdownOpen(!isToDropdownOpen)
              }}
              className="flex items-center py-2 px-4 rounded-md bg-[#374151] border border-[#374151] hover:border-white w-full"
            >
              <div>TO:</div>
              {isToDropdownOpen ? (
                <ChevronUpIcon className="w-5 h-5 ml-2" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 ml-2" />
              )}
            </button>

            {isToDropdownOpen && (
              <ul className="ml-10 list-disc">
                {emote?.receiverSymbols && emote?.receiverSymbols.map((receiverSymbol) => {

                  return (
                    <li key={receiverSymbol}>
                      <A
                        onClick={(event) => {
                          event.stopPropagation()
                          ModalService.open(SymbolSelectModal, { symbol: receiverSymbol })
                        }}
                        className="text-blue-500 hover:text-blue-700 cursor-pointer"
                      >
                        {receiverSymbol}
                      </A>
                    </li>
                  )
                })}
              </ul>
            )}

          </div>

          <div className="mt-3">

            <button onClick={(event) => {
              event.stopPropagation()
              setIsSentSymbolsDropdownOpen(!isSentSymbolsDropdownOpen)
            }} className="flex items-center py-2 px-4 rounded-md bg-[#374151] border border-[#374151] hover:border-white w-full">
              <div>SENT SYMBOLS:</div>
              {isSentSymbolsDropdownOpen ? (
                <ChevronUpIcon className="w-5 h-5 ml-2" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 ml-2" />
              )}
            </button>

            {isSentSymbolsDropdownOpen && (
              <ul className="ml-10 list-disc">
                {emote?.sentSymbols && emote?.sentSymbols.map((sentSymbol) => {

                  return (
                    <li key={sentSymbol}>
                      <A
                        onClick={(event) => {
                          event.stopPropagation()
                          ModalService.open(SymbolSelectModal, { symbol: sentSymbol })
                        }}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        {sentSymbol}
                      </A>
                    </li>
                  )
                })}
              </ul>
            )}

          </div>

        </div>
      ): (
        <div>
          <A
            onClick={(event) => {
              event.stopPropagation()
              ModalService.open(SymbolSelectModal, { symbol: emote?.senderTwitterUsername })
            }}
            className="text-blue-500 hover:text-blue-700 cursor-pointer"
          >
            {emote?.senderTwitterUsername}
          </A> sent{' '}

          {isMultipleSentSymbols ? (
            <span
              ref={sentSymbolsRef}
              onClick={(event) => event.stopPropagation()}
              className="relative rounded-full inline-flex justify-center items-center cursor-pointer"
            >
              <span className="text-red-500 hover:text-red-700 cursor-pointer">{sentSymbolsCount} symbols</span>

              {sentSymbolsTooltipVisibility && (
                <div
                  onClick={(event) => {
                    event.stopPropagation()
                    setSentSymbolsTooltipVisibility(false)
                  }}
                  className="absolute z-[600] h-[6rem] w-[10rem] inset-y-0 right-0 top-full text-sm text-black rounded-xl shadow bg-white overflow-auto"
                >
                  <div className="flex flex-col w-full text-black font-semibold">
                    <div
                      onClick={(event) => {
                        event.stopPropagation()
                        onShowDetailsChanged(!showDetails)
                      }}
                      className="px-2 py-2 border-b flex items-center cursor-pointer hover:bg-gray-200 hover:bg-opacity-50"
                    >
                      <span>toggle details</span>
                    </div>

                  </div>
                </div>
              )}

            </span>
          ): (
            <A
              onClick={(event) => {
                event.stopPropagation()
                ModalService.open(SymbolSelectModal, { symbol: emote?.sentSymbols[0] })
              }}
              className="text-red-500 hover:text-red-700 cursor-pointer"
            >
              {emote?.sentSymbols[0]}
            </A>
          )} to{' '}

          {isMultipleReceivers ? (
            <span
              ref={receiversRef}
              onClick={(event) => event.stopPropagation()}
              className="relative rounded-full inline-flex justify-center items-center cursor-pointer"
            >
              {isPersonal ? (
                <span className="text-red-500 hover:text-red-700 cursor-pointer">you and {receiverSymbolsCount - 1} others</span>
              ): (
                <span className="text-red-500 hover:text-red-700 cursor-pointer">{receiverSymbolsCount} receivers</span>
              )}

              {receiversTooltipVisibility && (
                <div
                  onClick={(event) => {
                    event.stopPropagation()
                    setReceiversTooltipVisibility(false)
                  }}
                  className="absolute z-[600] h-[6rem] w-[10rem] inset-y-0 right-0 top-full text-sm text-black rounded-xl shadow bg-white overflow-auto"
                >
                  <div className="flex flex-col w-full text-black font-semibold">
                    <div
                      onClick={(event) => {
                        event.stopPropagation()
                        onShowDetailsChanged(!showDetails)
                      }}
                      className="px-2 py-2 border-b flex items-center cursor-pointer hover:bg-gray-200 hover:bg-opacity-50"
                    >
                      <span>toggle details</span>
                    </div>

                  </div>
                </div>
              )}

            </span>
          ): (
            <>
              {isPersonal ? (
                <span className="text-red-500 hover:text-red-700 cursor-pointer">you</span>
              ): (
                <A
                  onClick={(event) => {
                    event.stopPropagation()
                    ModalService.open(SymbolSelectModal, { symbol: emote?.receiverSymbols[0] })
                  }}
                  className="text-blue-500 hover:text-blue-700 cursor-pointer"
                >
                  {emote?.receiverSymbols[0]}
                </A>
              )}
            </>
          )} - {isPreview ? '1 minute ago' : formatTimeAgo(emote?.timestamp)}

        </div>
      )}

      {/* Emote button */}
      {(!isPreview && context !== "nou_sent") && (
        <div
          onClick={(event) => {
            event.stopPropagation()

            if (context === 'nou') {
              ModalService.open(NouEmoteModal, { initialEmote: emote, initialSymbol: emote?.sentSymbols[0], receiverSymbol: emote?.senderTwitterUsername })

            } else {
              const previousPathname = window.location.pathname
              window.history.pushState(null, null, '/desire')
              ModalService.open(SendEmoteModal, {}, () => window.history.pushState(null, null, previousPathname))
            }
            
          }}
          className="bg-blue-500 rounded-lg text-md text-white ml-auto mr-10 px-2 py-1 font-bold border border-blue-500 hover:border-white cursor-pointer"
        >
          emote
        </div>
      )}

      {(!isPreview) && (
        <div
          ref={optionsRef}
          onClick={(event) => event.stopPropagation()}
          className="absolute right-0 top-0 z-[600] w-10 h-10 ml-2 rounded-full p-1 hover:bg-gray-200 hover:bg-opacity-50 inline-flex justify-center items-center cursor-pointer"
        >
          {/* {clientHasReadDirectly ? (
            <EyeIcon className="w-6 h-6 inline text-green-500" />
          ) : (
            <EyeOffIcon className="w-6 h-6 inline text-red-500" />
          )} */}

          <DotsHorizontalIcon className="w-5 h-5 inline text-white" />


          {optionsTooltipVisibility && (
            <div
              onClick={(event) => {
                event.stopPropagation()
                setOptionsTooltipVisibility(false)
              }}
              className="absolute h-[6rem] w-[10rem] inset-y-0 right-0 top-full text-sm text-black rounded-xl shadow bg-white overflow-auto z-[600]"
            >
              <div className="flex flex-col w-full text-black font-semibold">
                <div
                  onClick={(event) => {
                    event.stopPropagation()
                    onShowDetailsChanged(!showDetails)
                  }}
                  className="px-2 py-2 border-b flex items-center cursor-pointer hover:bg-gray-200 hover:bg-opacity-50"
                >
                  <span>toggle details</span>
                </div>

                <div onClick={(event) => copyEmotePageURL(event)} className="px-2 py-2 border-b flex items-center cursor-pointer hover:bg-gray-200 hover:bg-opacity-50">
                  <span>copy link</span>
                </div>

                {/* <div onClick={(event) => onMarkSeenChanged(false)} className="px-2 py-2 flex items-center cursor-pointer hover:bg-gray-200 hover:bg-opacity-50">
                  <EyeOffIcon className="w-4 h-4 mr-1 inline text-red-500" />
                  <span>Mark unseen</span>
                </div> */}

              </div>
            </div>
          )}

        </div>
      )}

    </div>
  )
}
