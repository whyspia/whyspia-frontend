import { checkExistingTwitterProfile } from 'actions/users/apiUserActions'
import Modal from 'components/modals/Modal'
import { useContext, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import useOnClickOutside from 'utils/hooks/useOnClickOutside'
import debounce from 'lodash/debounce'
import { apiNewEmote } from 'actions/emotes/apiCreateEmote'
import { GlobalContext } from 'lib/GlobalContext'
import classNames from 'classnames'
import apiGetAllSymbols from 'actions/symbol/apiGetAllSymbols'
import { useInfiniteQuery } from 'react-query'
import DefineUI from './DefineUI'
import { twitterLogin } from 'modules/users/services/UserService'
import { EMOTE_CONTEXTS_ACTIVE, getContextPagePath } from 'modules/context/utils/ContextUtils'
import A from 'components/A'

const dontCloseOnURLStateChange = [
  '/desire', '/desire/send', '/desire/define', '/desire/search', '/desire/about', '/desire/context'
]

export default function SendEmoteModal({
  close,
  initialDesire = '',
}: {
  close: () => void
  initialDesire: string
}) {
  const { jwtToken, user } = useContext(GlobalContext)

  const [selectedButton, setSelectedButton] = useState(initialDesire)

  const [receiverSymbol, setreceiverSymbol] = useState(null)
  const [selectedSymbol, setSelectedSymbol] = useState('')
  
  const [isValidXUser, setIsValidXUser] = useState(false)
  const [isValid, setIsValid] = useState(false)

  const [isEmoteSending, setIsEmoteSending] = useState(false)

  const [isSortingDropdownOpen, setIsSortingDropdownOpen] = useState(false)
  const ref = useRef()
  useOnClickOutside(ref, () => setIsSortingDropdownOpen(false))

  useEffect(() => {
    const handlePopState = (event) => {
      // Check if the current URL is a modal URL
      if (!dontCloseOnURLStateChange.includes(window.location.pathname)) {
        close()
      } else if (window.location.pathname === '/desire') {
        setSelectedButton('desire')
      } else if (window.location.pathname === '/desire/send') {
        setSelectedButton('send')
      } else if (window.location.pathname === '/desire/define') {
        setSelectedButton('define')
      } else if (window.location.pathname === '/desire/context') {
        setSelectedButton('context')
      }
    } 

    window.addEventListener('popstate', handlePopState);

    // Cleanup listener when the component unmounts
    return () => {
      window.removeEventListener('popstate', handlePopState);
    }
  }, [])

  const fetchSymbols = async ({ pageParam = 0 }) => {
    const symbols = await apiGetAllSymbols({ skip: pageParam, limit: 2, orderBy: 'createdAt', orderDirection: 'asc', search: selectedSymbol })
    return symbols
  }

  const { data: symbols, fetchNextPage: fetchSymbolsNextPage, hasNextPage: hasSymbolsNextPage, isFetchingNextPage: isSymbolsFetchingNextPage } = useInfiniteQuery(
    ['symbols', 10, selectedSymbol],
    ({ pageParam = 0 }) =>
      fetchSymbols({
        pageParam
      }),
    {
      getNextPageParam: (lastGroup, allGroups) => {
        const morePagesExist = lastGroup?.length === 2
  
        if (!morePagesExist) {
          return false
        }
  
        return allGroups.length * 2
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: true,
      keepPreviousData: true,
    }
  )

  const formattedSymbols = symbols?.pages?.flatMap((page) =>
    page.map((symbol) => ({
      value: symbol.name.toLowerCase(),
      displayName: symbol.name.toLowerCase(),
    }))
  )

  const onSetReceiverChanged = debounce(async (username: string) => {
    const { isExisting, userToken } = await checkExistingTwitterProfile(username)

    setreceiverSymbol(userToken?.twitterUsername)

    setIsValidXUser(isExisting)
    setIsValid(isExisting && selectedSymbol !== '')
  }, 500)

  const onSendEmote = async () => {
    setIsEmoteSending(true)

    const emote = await apiNewEmote({
      jwt: jwtToken,
      receiverSymbols: [receiverSymbol],  // TODO: make so multiple symbols are used here
      sentSymbols: [selectedSymbol],      // TODO: make so multiple symbols are used here
    })
  
    if (emote) {
      console.log('emote created successfully:', emote)
    } else {
      console.error('Failed to create emote')
    }

    setIsEmoteSending(false)

    toast.success(`"${selectedSymbol}" has been sent to ${receiverSymbol}!`)
  }

  const onDesireClicked = (desire: string) => {
    if (desire === 'search') {
      window.open(`/desire/search`)
    } else if (desire === 'about') {
      window.open(`/desire/about`)
    } else {
      window.history.pushState(null, null, `/desire/${desire}`)
      setSelectedButton(desire)
    }
    
  }

  const onSymbolTyped = (symbol: string) => {
    setSelectedSymbol(symbol)
    setIsValid(isValidXUser && symbol !== '')
  }

  return (
    <Modal close={close}>
      <div className="p-6 w-96 md:w-[30rem] text-white">

        <div className="text-2xl font-bold">why are you here? what do you desire?</div>

        <div className="flex flex-wrap justify-center mt-6">
          <button
            onClick={() => onDesireClicked('context')}
            className={classNames(
              'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-purple-600 border border-purple-600 cursor-pointer',
              selectedButton === 'context' ? 'bg-purple-500' : '',
            )}
          >
            go to context
          </button>

          <button
            onClick={() => onDesireClicked('send')}
            className={classNames(
              'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-purple-600 border border-purple-600 cursor-pointer',
              selectedButton === 'send' ? 'bg-purple-500' : '',
            )}
          >
            send symbol
          </button>

          <button
            onClick={() => onDesireClicked('define')}
            className={classNames(
              'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-purple-600 border border-purple-600 cursor-pointer',
              selectedButton === 'define' ? 'bg-purple-500' : '',
            )}
          >
            define symbol
          </button>

          <button
            onClick={() => onDesireClicked('search')}
            className={classNames(
              'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-purple-600 border border-purple-600 cursor-pointer',
              selectedButton === 'search' ? 'bg-purple-500' : '',
            )}
          >
            search symbols or users
          </button>
          
          <button
            onClick={() => onDesireClicked('about')}
            className={classNames(
              'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-purple-600 border border-purple-600 cursor-pointer',
              selectedButton === 'about' ? 'bg-purple-500' : '',
            )}
          >
            about
          </button>
        </div>

        {selectedButton === 'send' && (
          <>
            {!user?.twitterUsername ? (
              <>
                <div
                  onClick={() => twitterLogin(null)}
                  className="relative h-full z-[500] flex justify-center items-center px-4 py-2 ml-2 text-xs font-bold text-white rounded-xl bg-[#1DA1F2] rounded-xl"
                >
                  connect X
                </div>
              </>
            ) : (
              <div>
                
                <div className="font-bold text-lg mb-1">send to:</div>

                <textarea
                  onChange={(event) => onSetReceiverChanged(event.target.value)}
                  placeholder="enter X username..."
                  className="w-full rounded-lg px-2 py-1"
                />

                <div className="font-bold text-lg mb-1">symbol to send:</div>

                <textarea
                  value={selectedSymbol}
                  onChange={(event) => onSymbolTyped(event.target.value)}
                  placeholder="enter symbol..."
                  className="w-full rounded-lg px-2 py-1"
                />

                {/* Send button */}
                <button
                  onClick={onSendEmote}
                  className={classNames(
                    'block rounded-lg text-white px-4 py-2 mt-4 font-bold',
                    {
                      'bg-gray-400': !isValid,
                      'bg-blue-500 cursor-pointer': isValid,
                    }
                  )}
                  disabled={!isValid}
                >
                  send
                </button>

              </div>
            )}
            
          </>
        )}

        {selectedButton === 'define' && (
          <>
            {!user?.twitterUsername ? (
              <>
                <div
                  onClick={() => twitterLogin(null)}
                  className="relative h-full z-[500] flex justify-center items-center px-4 py-2 ml-2 text-xs font-bold text-white rounded-xl bg-[#1DA1F2] rounded-xl"
                >
                  connect X
                </div>
              </>
            ) : (
              <DefineUI jwtToken={jwtToken} />
            )}
          </>
        )}

        {selectedButton === 'context' && (
          <>
            <div className="text-2xl font-bold mb-6">choose context to go to</div>

            <div className="mb-4 flex flex-wrap">
              {Object.values(EMOTE_CONTEXTS_ACTIVE).map((c) => (
                <A
                  key={c}
                  onClick={() => close()}
                  href={getContextPagePath(c)}
                  className={classNames(
                    'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-purple-600 border border-purple-600 cursor-pointer'
                  )}
                >
                  {c}
                </A>
              ))}
            </div>
          </>
        )}

      </div>
    </Modal>
  )
}
