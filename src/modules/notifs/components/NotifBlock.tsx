import { EmoteNotifSingleResponse } from "actions/notifs/apiGetAllEmoteNotifs"
import A from "components/A"
import { useEffect, useRef, useState } from "react"
import { formatTimeAgo } from "utils/randomUtils"
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline'
import { apiUpdateEmoteNotif } from "actions/notifs/apiUpdateEmoteNotif"


export const NotifBlock = ({
  notif,
  jwt
}: {
  notif: EmoteNotifSingleResponse
  jwt: string
}) => {
  const receiverSymbolsCount = notif?.emoteData?.receiverSymbols.length
  const isMultipleReceivers = receiverSymbolsCount > 1
  const [clientHasReadDirectly, setClientHasReadDirectly] = useState(notif?.hasReadDirectly)
  const [notifTooltipVisibility, setNotifTooltipVisibility] = useState(false)
  const notifRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifTooltipVisibility(false)
      } else {
        setNotifTooltipVisibility(true)
      }
    }
  
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const onMarkSeenChanged = (isMarkSeen: boolean) => {
    if (isMarkSeen) {
      apiUpdateEmoteNotif({ jwt, notifIDs: [notif.id], isCasualOrDirect: 'direct', isMarkingUnread: false })
    } else {
      apiUpdateEmoteNotif({ jwt, notifIDs: [notif.id], isCasualOrDirect: 'direct', isMarkingUnread: true })
    }

    setClientHasReadDirectly(isMarkSeen)
  }

  return (
    <div className="text-lg p-4 border border-white flex justify-center items-center">

      <div>
        <A href={`/u/${notif?.emoteData.senderTwitterUsername}`} className="text-blue-500 hover:text-blue-700 cursor-pointer">
          {notif?.emoteData.senderTwitterUsername}
        </A> sent "

        <A href={`/symbol/${notif?.emoteData.symbol}`} className="text-red-500 hover:text-red-700 cursor-pointer">
          {notif?.emoteData.symbol}
        </A>" to{' '}

        <A href={`/u/${notif?.receiverSymbol}`} className="text-blue-500 hover:text-blue-700 cursor-pointer">
          {notif?.receiverSymbol}{isMultipleReceivers && <span className="text-xs"> (+{receiverSymbolsCount - 1} more)</span>}
        </A> - {formatTimeAgo(notif?.timestamp)}
      </div>

      <div ref={notifRef} className="relative z-[600] w-10 h-10 ml-2 rounded-full p-1 hover:bg-gray-200 hover:bg-opacity-50 inline-flex justify-center items-center cursor-pointer">
        {clientHasReadDirectly ? (
          <EyeIcon className="w-6 h-6 inline text-green-500" />
        ) : (
          <EyeOffIcon className="w-6 h-6 inline text-red-500" />
        )}

        {notifTooltipVisibility && (
          <div
            onClick={() => setNotifTooltipVisibility(false)}
            className="absolute h-[6rem] w-[10rem] inset-y-0 left-0 top-full text-sm text-black rounded-xl shadow bg-white overflow-auto z-[600]"
          >
            <div className="flex flex-col w-full text-black font-semibold">
              <div onClick={() => onMarkSeenChanged(true)} className="px-2 py-2 border-b flex items-center cursor-pointer hover:bg-gray-200 hover:bg-opacity-50">
                <EyeIcon className="w-4 h-4 mr-1 inline text-green-500" />
                <span>Mark seen</span>
              </div>
              <div onClick={() => onMarkSeenChanged(false)} className="px-2 py-2 flex items-center cursor-pointer hover:bg-gray-200 hover:bg-opacity-50">
                <EyeOffIcon className="w-4 h-4 mr-1 inline text-red-500" />
                <span>Mark unseen</span>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  )
}
