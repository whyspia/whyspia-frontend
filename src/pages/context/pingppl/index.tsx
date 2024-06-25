import DefaultLayout from 'components/layouts/DefaultLayout'
import toast from 'react-hot-toast'
import { flatten } from 'lodash'
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/solid"
import { useContext, useState } from 'react'
import { useInfiniteQuery, useQueryClient } from 'react-query'
import { GlobalContext } from 'lib/GlobalContext'
import { twitterLogin } from 'modules/users/services/UserService'
import classNames from 'classnames'
import { apiNewEmote } from 'actions/emotes/apiCreateEmote'
import apiGetAllEmotes from 'actions/emotes/apiGetAllEmotes'
import { apiNewEmotesMany } from 'actions/emotes/apiCreateEmotesMany'
import { EMOTE_CONTEXTS } from 'modules/context/utils/ContextUtils'
import { SentEmoteBlock } from 'modules/symbol/components/SentEmoteBlock'

const PingPplPage = () => {
  const queryClient = useQueryClient()

  const { jwtToken, user } = useContext(GlobalContext)
  const [selectedTab, setSelectedTab] = useState('pingppl')
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [sendNow, setSendNow] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('')

  // const isValid = selectedSymbol?.length > 0

  // Mock data for scheduled events
  const scheduledEvents = [
    { id: 1, name: 'Team Meeting' },
    { id: 2, name: 'Product Launch' },
    { id: 3, name: 'Customer Webinar' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Event submitted:', { eventName, eventDate, eventDescription, sendNow });
  };

  const handleSendSelected = () => {
    console.log('Sending selected event:', selectedEvent);
  }

  const fetchEmotes = async ({ pageParam = 0 }) => {
    const emotes = await apiGetAllEmotes({ context: EMOTE_CONTEXTS.NANA, skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' })
    return emotes
  }

  // const { data: infiniteNanaEmotes, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
  //   ['infiniteNanaEmotes'],
  //   ({ pageParam = 0 }) =>
  //     fetchEmotes({
  //       pageParam
  //     }),
  //   {
  //     getNextPageParam: (lastGroup, allGroups) => {
  //       const morePagesExist = lastGroup?.length === 10

  //       if (!morePagesExist) {
  //         return false
  //       }

  //       return allGroups.length * 10
  //     },
  //     refetchOnMount: false,
  //     refetchOnWindowFocus: false,
  //     enabled: true,
  //     keepPreviousData: true,
  //   }
  // )

  // async function handleSendMessage() {
  //   setIsMessageSending(true)

  //   const emotes = [mainEmoteData, nanaContextEmoteData]

  //   const responseEmotes = await apiNewEmotesMany({
  //     jwt: jwtToken,
  //     emotes
  //   })
  
  //   if (responseEmotes) {
  //     console.log('emotes created successfully:', responseEmotes)
  //   } else {
  //     console.error('Failed to create emotes')
  //   }

  //   setIsMessageSending(false)

  //   queryClient.invalidateQueries(['infiniteNanaEmotes'])

  //   toast.success(`"${selectedSymbol}" has been sent to nana!`)
  // }

  // const nanaEmotesData = flatten(infiniteNanaEmotes?.pages || [])

  return (
    <div className="h-screen flex flex-col items-center mt-4">

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

            <div className="w-full max-w-md mx-auto mt-4 p-4 bg-black text-black rounded-lg shadow-md">

              <div className="flex flex-wrap justify-center mt-6">
                <button
                  onClick={() => setSelectedTab('pingppl')}
                  className={classNames(
                    'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-purple-600 border border-purple-600 cursor-pointer',
                    selectedTab === 'pingppl' ? 'bg-purple-500' : '',
                  )}
                >
                  pingppl
                </button>

                <button
                  onClick={() => setSelectedTab('plan-ping')}
                  className={classNames(
                    'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-purple-600 border border-purple-600 cursor-pointer',
                    selectedTab === 'plan-ping' ? 'bg-purple-500' : '',
                  )}
                >
                  plan ping
                </button>
              </div>

              {selectedTab === 'pingppl' && (
                <div className="mt-4">
                  {/* <h2 className="text-xl font-semibold mb-4">send created event</h2> */}

                  <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md mb-4 bg-dark3 text-white"
                  >
                    <option value="">select planned ping</option>
                    {scheduledEvents.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleSendSelected}
                    disabled={!selectedEvent}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-md flex items-center justify-center disabled:opacity-50"
                  >
                    {/* <Send className="w-4 h-4 mr-2" /> */}
                    pingppl
                  </button>
                </div>
              )}

              {selectedTab === 'plan-ping' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="ping name..."
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-md bg-dark3 text-white"
                  />
                  {/* <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  /> */}
                  <textarea
                    placeholder="ping description..."
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md bg-dark3 text-white"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="sendNow"
                      checked={sendNow}
                      onChange={(e) => setSendNow(e.target.checked)}
                      className="rounded text-blue-500 "
                    />
                    <label htmlFor="sendNow" className="text-white">pingppl immediately</label>
                  </div>

                  <div className="flex space-x-2">
                    <button type="submit" className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md flex items-center justify-center">
                      {sendNow ? (
                        <>
                          {/* <PlusCircle className="w-4 h-4 mr-2" /> */}
                          share plan & pingppl
                        </>
                      ) : (
                        <>
                          {/* <Calendar className="w-4 h-4 mr-2" /> */}
                          share plan (no ping)
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              

              
            </div>
            
          </>
        )}

        {/* <div className="mt-4 w-full flex flex-col items-center">
          {nanaEmotesData?.map((emote) => {
          
            return (
              <SentEmoteBlock context={EMOTE_CONTEXTS.NANA} emote={emote} jwt={jwtToken} user={user} key={emote.id} />
            )
          })}

          {hasNextPage && <button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </button>}
        </div> */}

        
      </>

    </div>
  )
}

(PingPplPage as any).layoutProps = {
  Layout: DefaultLayout,
}

export default PingPplPage
