// it's personal bc has options for editing and deleting the planned event

import { useEffect, useRef, useState } from "react"
import { getFrontendURL } from "utils/seo-constants"
import toast from 'react-hot-toast'
import { DotsHorizontalIcon } from "@heroicons/react/solid"
import { apiDeleteDefinedEvent } from "actions/pingppl/apiDeleteDefinedEvent"
import { useQueryClient } from "react-query"
import { UserProfile } from "types/customTypes"


export const PersonalPlannedEventBlock = ({
  plannedEvent,
  jwt,
  user,
}: {
  plannedEvent: any
  jwt?: string
  user?: UserProfile
}) => {
  const queryClient = useQueryClient()

  const [isPlannedPingDeleting, setIsPlannedPingDeleting] = useState(false)
  const [optionsTooltipVisibility, setOptionsTooltipVisibility] = useState(false)
  const optionsRef = useRef(null)

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

  // const copyEmotePageURL = (event) => {
  //   event?.stopPropagation()
  //   const url = `${getFrontendURL()}/emote/${emote?.id}`
  //   copy(url)
  //   toast.success('Copied emote page URL')
  // }

  const onDeletePlannedPing = async () => {
    setIsPlannedPingDeleting(true)

    const result = await apiDeleteDefinedEvent({ jwt, definedEventId: plannedEvent?.id })
  
    if (result) {
      console.log('planned ping deleted successfully:', result)
    } else {
      console.error('Failed to delete planned ping')
      setIsPlannedPingDeleting(false)
      return
    }

    setIsPlannedPingDeleting(false)

    queryClient.invalidateQueries([`infiniteDefinedEvents-${user?.twitterUsername}`])

    toast.success(`successfully deleted planned ping!`)
  }

  return (
    <div
      // onClick={(event) => ModalService.open(EmoteSelectModal, { emote: notif?.notifData })}
      className="relative w-full text-lg p-4 border border-white hover:bg-gray-100 hover:bg-opacity-[.1] cursor-pointer"
    >
      <div className="font-bold">{plannedEvent?.eventName}</div>
      <div className="text-xs">{plannedEvent?.eventDescription}</div>

      <div
        ref={optionsRef}
        onClick={(event) => event.stopPropagation()}
        className="absolute right-0 top-0 z-[600] w-10 h-10 ml-2 rounded-full p-1 hover:bg-gray-200 hover:bg-opacity-50 inline-flex justify-center items-center cursor-pointer"
      >
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
                  onDeletePlannedPing()
                }}
                className="px-2 py-2 border-b flex items-center cursor-pointer hover:bg-gray-200 hover:bg-opacity-50"
              >
                <span>delete planned ping</span>
              </div>

              {/* <div onClick={(event) => copyEmotePageURL(event)} className="px-2 py-2 border-b flex items-center cursor-pointer hover:bg-gray-200 hover:bg-opacity-50">
                <span>copy link</span>
              </div> */}

            </div>
          </div>
        )}

      </div>
    </div>
  )
}