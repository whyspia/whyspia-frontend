"use client"

// it's public bc does not have options for editing and deleting the planned event

import { useEffect, useRef, useState } from "react"
import toast from 'react-hot-toast'
import copy from 'copy-to-clipboard'
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid"
import ModalService from "components/modals/ModalService"
import ContextSelectModal from "modules/context/components/ContextSelectModal"
import { EMOTE_CONTEXTS } from "modules/context/utils/ContextUtils"
import YouGottaLoginModal from "modules/users/components/YouGottaLoginModal"
import PingpplUnfollowConfirmModal from "./PingpplUnfollowConfirmModal"
import PingpplFollowConfirmModal from "./PingpplFollowConfirmModal"
import { getFrontendURL } from "utils/seo-constants"
import PlannedPingReactModal from "./PlannedPingReactModal"


export const PublicPlannedPingBlock = ({
  plannedEvent,
  jwt,
  isLoggedInUserFollowing = false,
  pingpplFollowId,  // if loggedinuser is following, this is id of their follow
}: {
  plannedEvent: any
  jwt?: string | null
  isLoggedInUserFollowing?: boolean
  pingpplFollowId?: string
}) => {
  const [optionsTooltipVisibility, setOptionsTooltipVisibility] = useState(false)
  const optionsRef = useRef(null)

  const [followingOrUnfollowHoveredId, setFollowingOrUnfollowHoveredId] = useState<string | null>(null)

  const handleMouseEnter = (id: string) => {
    setFollowingOrUnfollowHoveredId(id)
  }

  const handleMouseLeave = () => {
    setFollowingOrUnfollowHoveredId(null)
  }

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

  const copyEmotePageURL = (event) => {
    event?.stopPropagation()
    const url = `${getFrontendURL()}/planned-ping/${plannedEvent?.id}`
    copy(url)
    toast.success('copied planned-ping page URL')
  }

  return (
    <div
      onClick={(event) => ModalService.open(PlannedPingReactModal, { plannedEvent })}
      className="relative flex w-full text-lg p-4 border border-white hover:bg-gray-100 hover:bg-opacity-[.1] cursor-pointer"
    >
      <div>
        <div className="font-bold">{plannedEvent?.eventName}</div>
        <div className="text-xs whitespace-pre-wrap break-words leading-5">{plannedEvent?.eventDescription}</div>
      </div>

      {isLoggedInUserFollowing ? (
        <div
          onClick={(e) => {
            e.stopPropagation()
            if (!jwt) {
              ModalService.open(YouGottaLoginModal, {  })
            } else {
              ModalService.open(PingpplUnfollowConfirmModal, { pingpplFollowId, eventNameFollowed: plannedEvent?.eventName, eventSenderUser: plannedEvent?.eventCreatorUser, eventDescription: plannedEvent?.eventDescription })
            }
            
          }}
          className="transition-colors duration-300 flex items-center bg-[#1d8f89] rounded-lg text-md text-white ml-auto mr-10 px-2 font-bold border border-[#1d8f89] hover:border-white hover:bg-red-500 cursor-pointer"
          onMouseEnter={() => handleMouseEnter(plannedEvent?.id)}
          onMouseLeave={handleMouseLeave}
        >
          {followingOrUnfollowHoveredId === plannedEvent?.id ? 'unfollow' : 'following'}
        </div>
      ): (
        <div
          onClick={(e) => {
            e.stopPropagation()
            if (!jwt) {
              ModalService.open(YouGottaLoginModal, {  })
            } else {
              ModalService.open(PingpplFollowConfirmModal, { eventNameFollowed: plannedEvent?.eventName, eventSenderUser: plannedEvent?.eventCreatorUser, eventDescription: plannedEvent?.eventDescription })
            }
            
          }}
          className="flex items-center bg-[#1d8f89] rounded-lg text-md text-white ml-auto mr-10 px-2 font-bold border border-[#1d8f89] hover:border-white cursor-pointer"
        >
          follow
        </div>
      )}

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

        <EllipsisHorizontalIcon className="w-5 h-5 inline text-white" />


        {optionsTooltipVisibility && (
          <div
            onClick={(event) => {
              event.stopPropagation()
              setOptionsTooltipVisibility(false)
            }}
            className="absolute h-[6rem] w-[10rem] inset-y-0 right-0 top-full text-sm text-black rounded-xl shadow bg-white overflow-auto z-[600]"
          >
            <div className="flex flex-col w-full text-black font-semibold">

              <div onClick={(event) => copyEmotePageURL(event)} className="px-2 py-2 border-b flex items-center cursor-pointer hover:bg-gray-200 hover:bg-opacity-50">
                <span>copy link</span>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  )
}