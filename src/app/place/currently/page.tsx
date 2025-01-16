"use client"

import toast from 'react-hot-toast'
import { useContext, useState, useEffect, } from 'react'
import { useInfiniteQuery, useQueryClient, useQuery } from 'react-query'
import { GlobalContext } from 'lib/GlobalContext'
import classNames from 'classnames'
import A from 'components/A'
import ModalService from 'components/modals/ModalService'
import useAuth from 'modules/users/hooks/useAuth'
import PersonClickModal from 'modules/users/components/PersonClickModal'
import CurrentlyEditPlaceModal from 'modules/places/currently/components/CurrentlyEditPlaceModal'
import CurrentlyEditStatusModal from 'modules/places/currently/components/CurrentlyEditStatusModal'
import CurrentlyEditTagsModal from 'modules/places/currently/components/CurrentlyEditTagsModal'
import { 
  getDisplayTimeLeft
} from 'modules/places/currently/types/durationTypes'
import { apiGetCurrentlySingleWithAnyActiveField } from 'actions/currently/apiGetCurrentlySingle'
import { CurrentlyResponse, CurrentlyPlace, CurrentlyTag, CurrentlyStatus } from 'modules/places/currently/types/apiCurrentlyTypes'
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline'
import CurrentlyRemoveConfirmModal from 'modules/places/currently/components/CurrentlyRemoveConfirmModal'
import { apiUpdateCurrently, deletePlace, deleteStatus, deleteTag, clearAll } from 'actions/currently/apiUpdateCurrently'
import { apiGetAllCurrentlyWithAnyActiveField } from 'actions/currently/apiGetAllCurrently'
import { debounce } from 'lodash'
import CurrentlyFollowModal from 'modules/places/currently/components/CurrentlyFollowModal'


const CurrentlyPage = () => {
  const queryClient = useQueryClient()
  const { jwtToken, userV2: loggedInUser } = useContext(GlobalContext)
  const { handleParticleAndWhyspiaLogin } = useAuth()

  const [inputPlace, setInputPlace] = useState<CurrentlyPlace | null>(null)
  const [inputTags, setInputTags] = useState<CurrentlyTag[]>([])
  const [inputStatus, setInputStatus] = useState<CurrentlyStatus | null>(null)
  const [activeTab, setActiveTab] = useState<'you' | 'saved' | 'everyone'>('you')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFollowModal, setShowFollowModal] = useState(false)
  const [showPingModal, setShowPingModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  // Fetch current data
  const { data: currentlyData } = useQuery<CurrentlyResponse>(
    ['currently', loggedInUser?.primaryWallet],
    () => apiGetCurrentlySingleWithAnyActiveField({
      jwt: jwtToken,
      senderPrimaryWallet: loggedInUser?.primaryWallet
    }),
    {
      enabled: !!loggedInUser?.primaryWallet && !!jwtToken,
      refetchOnWindowFocus: true
    }
  )

  // Update local state when data is fetched
  useEffect(() => {
    if (currentlyData) {
      if (currentlyData.place) {
        setInputPlace(currentlyData.place)
      }

      if (currentlyData.wantOthersToKnowTags?.length > 0) {
        setInputTags(currentlyData.wantOthersToKnowTags)
      }

      if (currentlyData.status) {
        setInputStatus(currentlyData.status)
      }
    }
  }, [currentlyData])

  const isThereAnyInput = inputPlace || (inputTags && inputTags?.length > 0) || inputStatus

  const handleRemovePlace = async () => {
    try {
      const result = await apiUpdateCurrently({
        jwt: jwtToken,
        updates: [deletePlace()]
      })
      if (!result) {
        toast.error('failed to leave place')
        return
      }
      setInputPlace(null)
      toast.success('you left this place')
    } catch (error) {
      toast.error('failed to leave place')
    }
  }

  const handleRemoveStatus = async () => {
    try {
      const result = await apiUpdateCurrently({
        jwt: jwtToken,
        updates: [deleteStatus()]
      })
      if (!result) {
        toast.error('failed to remove status')
        return
      }
      setInputStatus(null)
      toast.success('status removed successfully')
    } catch (error) {
      toast.error('failed to remove status')
    }
  }

  const handleRemoveTag = async (inputTag: string) => {
    try {
      const result = await apiUpdateCurrently({
        jwt: jwtToken,
        updates: [deleteTag(inputTag)]
      })
      if (!result) {
        toast.error('failed to remove tag')
        return
      }
      setInputTags(inputTags.filter(tag => tag.tag !== inputTag))
      toast.success('tag removed successfully')
    } catch (error) {
      toast.error('failed to remove tag')
    }
  }

  const isAnyFieldActive = () => {
    return !!(inputPlace || inputStatus || (inputTags && inputTags.length > 0))
  }

  const fetchActiveCurrentlies = async ({ pageParam = 0 }) => {
    const currentlyList = await apiGetAllCurrentlyWithAnyActiveField({
      jwt: jwtToken,
      skip: pageParam,
      limit: 10,
      orderBy: 'updatedAt',
      orderDirection: 'desc',
      filterBySavedPeopleOfRequestingUser: true,
      search: searchQuery
    })
    
    return currentlyList ? currentlyList : []
  }

  // Add query for saved people's currently data
  const {
    data: savedPeopleCurrently,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery(
    [`currently-saved-people-${loggedInUser?.primaryWallet}`, searchQuery],
    ({ pageParam = 0 }) => fetchActiveCurrentlies({
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
      refetchOnWindowFocus: true,
      enabled: !!loggedInUser?.primaryWallet && !!jwtToken && activeTab === 'saved',
      keepPreviousData: true,
    }
  )

  // Add a new fetch function for everyone's currently data
  const fetchEveryonesCurrentlies = async ({ pageParam = 0 }) => {
    const currentlyList = await apiGetAllCurrentlyWithAnyActiveField({
      jwt: jwtToken,
      skip: pageParam,
      limit: 10,
      orderBy: 'updatedAt',
      orderDirection: 'desc',
      filterBySavedPeopleOfRequestingUser: false,
      search: searchQuery
    })
    
    return currentlyList ? currentlyList : []
  }

  // Add query for everyone's currently data
  const {
    data: everyonesCurrently,
    fetchNextPage: fetchNextPageEveryone,
    hasNextPage: hasNextPageEveryone,
    isFetchingNextPage: isFetchingNextPageEveryone
  } = useInfiniteQuery(
    [`currently-everyone-${loggedInUser?.primaryWallet}`, searchQuery],
    ({ pageParam = 0 }) => fetchEveryonesCurrentlies({
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
      refetchOnWindowFocus: true,
      enabled: !!loggedInUser?.primaryWallet && !!jwtToken && activeTab === 'everyone',
      keepPreviousData: true,
    }
  )

  const renderCurrentlyCard = (currently: CurrentlyResponse) => {
    return (
      <div className="relative group">
        <div className="absolute top-2 right-2 hidden md:block z-[600]">
          <button 
            className="px-3 py-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              ModalService.open(CurrentlyFollowModal, {
                userToken: currently.senderUser
              })
            }}
          >
            follow options
          </button>
        </div>

        <div className="absolute top-2 right-2 md:hidden block z-[600]">
          <button 
            className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              ModalService.open(CurrentlyFollowModal, {
                userToken: currently.senderUser
              })
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
          </button>
        </div>

        <div className="p-6 border-2 border-white rounded-2xl group/main relative mb-4">
          <A
            onClick={(event) => {
              event.stopPropagation()
              ModalService.open(PersonClickModal, { userToken: currently.senderUser })
            }}
            className="text-blue-500 hover:text-blue-700 cursor-pointer text-lg"
          >
            {currently.senderUser?.calculatedDisplayName}
          </A>

          {currently.place && (
            <div 
              className="mt-2 p-4 bg-[#1d8f89]/50 rounded-lg relative cursor-pointer hover:bg-[#1d8f89]/60"
              onClick={(e) => {
                e.stopPropagation()
                ModalService.open(CurrentlyFollowModal, {
                  userToken: currently.senderUser,
                  selectedPlace: currently.place
                })
              }}
            >
              <div className="absolute top-0 right-0 text-xs rounded-tr-lg rounded-bl-lg" style={{ background: 'rgb(29 143 137)' }}>
                <div className="bg-[#1d8f89] px-3 py-1 rounded-tr-lg rounded-bl-lg">
                  {getDisplayTimeLeft(currently.place.duration, currently.place.updatedDurationAt)}
                </div>
                <div className="absolute inset-0 bg-[#1d8f89]/50 rounded-tr-lg rounded-bl-lg" style={{ zIndex: -1 }}></div>
              </div>
              <span className="text-gray-400 font-semibold font-mono">PLACE:</span>
              <div className="mt-2">
                <div className="text-sm">
                  {currently.place.text}
                </div>
              </div>
            </div>
          )}

          {currently.wantOthersToKnowTags?.length > 0 && (
            <div className="mt-2 p-4 bg-[#1d8f89]/50 rounded-lg">
              <span className="text-gray-400 font-semibold font-mono">WANT_YOU_TO_KNOW_TAGS:</span>
              <div className="mt-2">
                {currently.wantOthersToKnowTags.map((tag, index) => (
                  <div 
                    key={index} 
                    className="inline-block bg-[#1d8f89] rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 cursor-pointer hover:bg-[#1d8f89]/80"
                    onClick={(e) => {
                      e.stopPropagation()
                      ModalService.open(CurrentlyFollowModal, {
                        userToken: currently.senderUser,
                        selectedTag: tag
                      })
                    }}
                  >
                    <span>{tag.tag}</span>
                    <span className="mx-1 opacity-60">·</span>
                    <span className="opacity-60">
                      {getDisplayTimeLeft(tag.duration, tag.updatedDurationAt)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currently.status && (
            <div className="mt-2 p-4 bg-[#1d8f89]/50 rounded-lg relative">
              <div className="absolute top-0 right-0 text-xs rounded-tr-lg rounded-bl-lg" style={{ background: 'rgb(29 143 137)' }}>
                <div className="bg-[#1d8f89] px-3 py-1 rounded-tr-lg rounded-bl-lg">
                  {getDisplayTimeLeft(currently.status.duration, currently.status.updatedDurationAt)}
                </div>
                <div className="absolute inset-0 bg-[#1d8f89]/50 rounded-tr-lg rounded-bl-lg" style={{ zIndex: -1 }}></div>
              </div>
              <span className="text-gray-400 font-semibold font-mono">STATUS:</span>
              <div className="mt-2">
                <div className="text-sm">
                  {currently.status.text}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col items-center mt-4 px-4">
      <div className="md:w-[37rem] w-full flex flex-col justify-center items-center">
        <div className="text-lg md:text-3xl font-bold mb-8">
          CURRENTLY: share with others what is current for you
        </div>

        {!jwtToken ? (
          <>
            <div
              onClick={handleParticleAndWhyspiaLogin}
              className="relative h-20 flex justify-center items-center px-4 py-2 ml-2 mb-8 text-xs font-bold text-white rounded-xl bg-[#1DA1F2] rounded-xl cursor-pointer"
            >
              login
            </div>
          </>
        ) : (
          <div className="w-full flex flex-col justify-center items-center">
            <div className="w-full flex flex-wrap justify-center mb-6">
              <button
                onClick={() => setActiveTab('you')}
                className={classNames(
                  'relative p-3 mb-4 mr-2 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer',
                  activeTab === 'you' ? 'bg-[#1d8f89] selected-tab-triangle' : '',
                )}
              >
                you
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={classNames(
                  'relative p-3 mb-4 mr-2 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer',
                  activeTab === 'saved' ? 'bg-[#1d8f89] selected-tab-triangle' : '',
                )}
              >
                your saved people
              </button>
              <button
                onClick={() => setActiveTab('everyone')}
                className={classNames(
                  'relative p-3 mb-4 mr-2 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer',
                  activeTab === 'everyone' ? 'bg-[#1d8f89] selected-tab-triangle' : '',
                )}
              >
                everyone
              </button>
            </div>

            {activeTab === 'you' ? (
              <>
                <div className="w-full flex flex-col sm:flex-row sm:justify-between gap-2 mb-8">
                  <button
                    onClick={() => ModalService.open(CurrentlyEditPlaceModal, { 
                      onConfirm: setInputPlace, 
                      currentPlace: inputPlace,
                      jwt: jwtToken,
                      isAnyFieldActive: isAnyFieldActive() 
                    })}
                    className="px-4 py-2 bg-[#1d8f89] border border-[#1d8f89] hover:border-white disabled:opacity-50 text-white rounded-md"
                  >
                    {inputPlace ? 'edit' : 'add'} PLACE
                  </button>
                  <button
                    onClick={() => ModalService.open(CurrentlyEditTagsModal, { 
                      onConfirm: setInputTags, 
                      currentTags: inputTags,
                      jwt: jwtToken,
                      isAnyFieldActive: isAnyFieldActive()
                    })}
                    className="px-4 py-2 bg-[#1d8f89] border border-[#1d8f89] hover:border-white disabled:opacity-50 text-white rounded-md"
                  >
                    {inputTags.length > 0 ? 'edit' : 'add'} WANT_YOU_TO_KNOW_TAGS
                  </button>
                  <button
                    onClick={() => ModalService.open(CurrentlyEditStatusModal, { 
                      onConfirm: setInputStatus, 
                      currentStatus: inputStatus,
                      jwt: jwtToken,
                      isAnyFieldActive: isAnyFieldActive()
                    })}
                    className="px-4 py-2 bg-[#1d8f89] border border-[#1d8f89] hover:border-white disabled:opacity-50 text-white rounded-md"
                  >
                    {inputStatus ? 'edit' : 'add'} STATUS
                  </button>
                </div>
                <div className="w-full">
                  <div className="font-bold text-lg mb-2">PUBLIC VIEW:</div>
                  
                  <div className="p-6 border-2 border-white rounded-2xl group/main relative">
                    {isThereAnyInput && (
                      <div className="absolute -right-3 -top-3 hidden group-hover/main:block z-[60]">
                        <button
                          onClick={() => ModalService.open(CurrentlyRemoveConfirmModal, {
                            title: "clear all",
                            message: "are you sure you want to clear everything?",
                            onConfirm: async () => {
                              try {
                                const result = await apiUpdateCurrently({
                                  jwt: jwtToken,
                                  updates: [clearAll()]
                                })
                                if (!result) {
                                  toast.error('failed to clear all')
                                  return
                                }
                                setInputPlace(null)
                                setInputStatus(null)
                                setInputTags([])
                                toast.success('cleared everything successfully')
                              } catch (error) {
                                toast.error('failed to clear all')
                              }
                            }
                          })}
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 border border-white"
                        >
                          <TrashIcon className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    )}

                    <A
                      onClick={(event) => {
                        event.stopPropagation()
                        ModalService.open(PersonClickModal, { userToken: loggedInUser })
                      }}
                      className="text-blue-500 hover:text-blue-700 cursor-pointer text-lg"
                    >
                      {loggedInUser?.chosenPublicName}
                    </A>

                    {inputPlace && (
                      <div className="mt-2 p-4 bg-[#1d8f89]/50 rounded-lg relative group/place">
                        <div className="absolute -right-2 -top-2 hidden group-hover/place:block z-[60]">
                          <button
                            onClick={() => ModalService.open(CurrentlyRemoveConfirmModal, {
                              title: "leave place",
                              message: "are you sure you want to leave this place?",
                              onConfirm: handleRemovePlace
                            })}
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                          >
                            <XMarkIcon className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                        <div className="absolute top-0 right-0 text-xs rounded-tr-lg rounded-bl-lg" style={{ background: 'rgb(29 143 137)' }}>
                          <div className="bg-[#1d8f89] px-3 py-1 rounded-tr-lg rounded-bl-lg">
                            {getDisplayTimeLeft(inputPlace.duration, inputPlace.updatedDurationAt)}
                          </div>
                          <div className="absolute inset-0 bg-[#1d8f89]/50 rounded-tr-lg rounded-bl-lg" style={{ zIndex: -1 }}></div>
                        </div>
                        <span className="text-gray-400 font-semibold font-mono">PLACE:</span>
                        <div className="mt-2">
                          <div className="text-sm">
                            {inputPlace.text}
                          </div>
                        </div>
                      </div>
                    )}

                    {inputTags.length > 0 && (
                      <div className="mt-2 p-4 bg-[#1d8f89]/50 rounded-lg">
                        <span className="text-gray-400 font-semibold font-mono">WANT_YOU_TO_KNOW_TAGS:</span>
                        <div className="mt-2">
                          {inputTags.map((tag, index) => (
                            <div key={index} className="inline-block bg-[#1d8f89] rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 relative group/tag">
                              <div className="absolute -right-1 -top-1 hidden group-hover/tag:block">
                                <button
                                  onClick={() => ModalService.open(CurrentlyRemoveConfirmModal, {
                                    title: "remove tag",
                                    message: "are you sure you want to remove this tag?",
                                    onConfirm: () => handleRemoveTag(tag.tag)
                                  })}
                                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                                >
                                  <XMarkIcon className="w-3 h-3 text-gray-600 z-[600]" />
                                </button>
                              </div>
                              <span>{tag.tag}</span>
                              <span className="mx-1 opacity-60">·</span>
                              <span className="opacity-60">
                                {getDisplayTimeLeft(tag.duration, tag.updatedDurationAt)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {inputStatus && (
                      <div className="mt-2 p-4 bg-[#1d8f89]/50 rounded-lg relative group/status">
                        <div className="absolute -right-2 -top-2 hidden group-hover/status:block z-[60]">
                          <button
                            onClick={() => ModalService.open(CurrentlyRemoveConfirmModal, {
                              title: "remove status",
                              message: "are you sure you want to remove this status?",
                              onConfirm: handleRemoveStatus
                            })}
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                          >
                            <XMarkIcon className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                        <div className="absolute top-0 right-0 text-xs rounded-tr-lg rounded-bl-lg" style={{ background: 'rgb(29 143 137)' }}>
                          <div className="bg-[#1d8f89] px-3 py-1 rounded-tr-lg rounded-bl-lg">
                            {getDisplayTimeLeft(inputStatus.duration, inputStatus.updatedDurationAt)}
                          </div>
                          <div className="absolute inset-0 bg-[#1d8f89]/50 rounded-tr-lg rounded-bl-lg" style={{ zIndex: -1 }}></div>
                        </div>
                        <span className="text-gray-400 font-semibold font-mono">STATUS:</span>
                        <div className="mt-2">
                          <div className="text-sm">
                            {inputStatus.text}
                          </div>
                        </div>
                      </div>
                    )}

                    {!isThereAnyInput && (<div className="text-xs text-gray-500">nothing shared yet...</div>)}
                  </div>
                </div>
              </>
            ) : activeTab === 'saved' ? (
              <div className="w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                  }}
                  placeholder="search..."
                  className="w-full px-3 py-2 mb-4 bg-dark3 text-white border border-[#1d8f89] rounded-md focus:outline-none focus:border-white"
                />

                {savedPeopleCurrently?.pages.map((page, i) => (
                  <div key={i}>
                    {page.map((currently, index) => (
                      <div key={index}>
                        {renderCurrentlyCard(currently)}
                      </div>
                    ))}
                  </div>
                ))}
                
                {hasNextPage && (
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="w-full py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mt-4"
                  >
                    {isFetchingNextPage ? 'Loading more...' : 'Load more'}
                  </button>
                )}
                
                {!savedPeopleCurrently?.pages[0]?.length && (
                  <div className="text-center text-gray-500 mt-4">
                    currently, your saved people have nothing to share
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                  }}
                  placeholder="search..."
                  className="w-full px-3 py-2 mb-4 bg-dark3 text-white border border-[#1d8f89] rounded-md focus:outline-none focus:border-white"
                />

                {everyonesCurrently?.pages.map((page, i) => (
                  <div key={i}>
                    {page.map((currently, index) => (
                      <div key={index}>
                        {renderCurrentlyCard(currently)}
                      </div>
                    ))}
                  </div>
                ))}
                
                {hasNextPageEveryone && (
                  <button
                    onClick={() => fetchNextPageEveryone()}
                    disabled={isFetchingNextPageEveryone}
                    className="w-full py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mt-4"
                  >
                    {isFetchingNextPageEveryone ? 'Loading more...' : 'Load more'}
                  </button>
                )}
                
                {!everyonesCurrently?.pages[0]?.length && (
                  <div className="text-center text-gray-500 mt-4">
                    no one is sharing anything currently
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CurrentlyPage