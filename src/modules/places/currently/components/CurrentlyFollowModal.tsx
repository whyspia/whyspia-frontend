"use client"

import React, { useState, useContext } from 'react'
import toast from 'react-hot-toast'
import Modal from 'components/modals/Modal'
import { UserV2PublicProfile } from 'modules/users/types/UserNameTypes'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { CurrentlyPlace, CurrentlyTag } from '../types/apiCurrentlyTypes'
import { useQuery, useQueryClient, useInfiniteQuery } from 'react-query'
import { apiCreatePingpplFollow } from 'actions/pingppl/apiCreatePingpplFollow'
import { apiDeletePingpplFollow } from 'actions/pingppl/apiDeletePingpplFollow'
import YouGottaLoginModal from 'modules/users/components/YouGottaLoginModal'
import { GlobalContext } from 'lib/GlobalContext'
import ModalService from 'components/modals/ModalService'
import apiGetAllPingpplFollows from 'actions/pingppl/apiGetAllPingpplFollows'
import CircleSpinner from 'components/animations/CircleSpinner'

interface CurrentlyFollowModalProps {
  close: () => void
  userToken: UserV2PublicProfile
  selectedPlace?: CurrentlyPlace
  selectedTag?: CurrentlyTag
}

type Section = 'tags' | 'places' | 'follows' | null

export default function CurrentlyFollowModal({
  close,
  userToken,
  selectedPlace,
  selectedTag
}: CurrentlyFollowModalProps) {
  const queryClient = useQueryClient()
  const { jwtToken, userV2: loggedInUser } = useContext(GlobalContext)
  const [activeSection, setActiveSection] = useState<Section>(
    selectedPlace ? 'places' : selectedTag ? 'tags' : null
  )
  const [customPlace, setCustomPlace] = useState('')
  const [customTag, setCustomTag] = useState('')
  const [isFollowLoading, setIsFollowLoading] = useState(false)

  const fetchAllPingpplFollowsOfLoggedInUser = async ({ pageParam = 0 }) => {
    const follows = await apiGetAllPingpplFollows({
      jwt: jwtToken,
      skip: pageParam,
      limit: 5,
      orderBy: 'updatedAt',
      orderDirection: 'desc',
      eventSender: userToken.primaryWallet,
      followSender: loggedInUser.primaryWallet,
    })
    
    return follows ? follows : []
  }

  // Get all follows for this user
  const {
    data: followsData,
    isLoading: isFollowsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery(
    [`pingpplFollows-${loggedInUser?.primaryWallet}`],
    ({ pageParam = 0 }) => fetchAllPingpplFollowsOfLoggedInUser({
      pageParam
    }),
    {
      enabled: !!jwtToken && !!loggedInUser?.primaryWallet,
      getNextPageParam: (lastGroup, allGroups) => {
        const morePagesExist = lastGroup?.length === 5

        if (!morePagesExist) {
          return false
        }

        return allGroups.length * 5
      },
      refetchOnMount: true
    }
  )

  const handleFollow = async (type: 'place' | 'tag', value: string) => {
    if (!value.trim()) {
      toast.error(`Please enter a ${type} first`)
      return
    }

    if (!jwtToken) {
      ModalService.open(YouGottaLoginModal, {})
      return
    }

    setIsFollowLoading(true)
    try {
      const response = await apiCreatePingpplFollow({
        jwt: jwtToken,
        eventNameFollowed: value.trim(),
        eventSender: userToken.primaryWallet,
      })

      if (response) {
        queryClient.invalidateQueries([`pingpplFollows-${loggedInUser?.primaryWallet}`])
        toast.success(`Following ${type} successfully`)
        // Clear input if it was a custom follow
        if (type === 'place') setCustomPlace('')
        if (type === 'tag') setCustomTag('')
      } else {
        toast.error(`Failed to follow ${type}`)
      }
    } catch (error) {
      toast.error(`Failed to follow ${type}`)
    } finally {
      setIsFollowLoading(false)
    }
  }

  const handleUnfollow = async (followId: string) => {
    setIsFollowLoading(true)
    try {
      const response = await apiDeletePingpplFollow({
        jwt: jwtToken,
        pingpplFollowId: followId
      })

      if (response) {
        queryClient.invalidateQueries([`pingpplFollows-${loggedInUser?.primaryWallet}`])
        toast.success('Unfollowed successfully')
      } else {
        toast.error('Failed to unfollow')
      }
    } catch (error) {
      toast.error('Failed to unfollow')
    } finally {
      setIsFollowLoading(false)
    }
  }

  const isFollowing = (value: string) => {
    return followsData?.pages.some(page => page.some(follow => follow.eventNameFollowed === value))
  }

  const getFollowId = (value: string) => {
    return followsData?.pages.find(page => page.some(follow => follow.eventNameFollowed === value))?.find(follow => follow.eventNameFollowed === value)?.id
  }

  const renderFollowButton = (value: string) => {
    const following = isFollowing(value)
    const followId = getFollowId(value)

    return (
      <button
        onClick={() => following ? handleUnfollow(followId!) : handleFollow('place', value)}
        disabled={isFollowLoading}
        className={classNames(
          "px-4 py-2 rounded-md whitespace-nowrap transition-colors",
          following ? "bg-[#1d8f89] hover:bg-red-500" : "bg-[#1d8f89] hover:bg-[#1d8f89]/80",
          isFollowLoading && "opacity-50 cursor-not-allowed"
        )}
      >
        {isFollowLoading ? (
          <span className="inline-flex items-center">
            <CircleSpinner color="#1d8f89" bgcolor="white" />
            <span className="ml-2">loading...</span>
          </span>
        ) : following ? 'unfollow' : 'follow'}
      </button>
    )
  }

  return (
    <Modal close={close}>
      <div className="p-6 w-full md:w-[30rem] text-white">
        <div className="mb-6 font-bold text-lg">
          follow {userToken.calculatedDisplayName}
        </div>
        
        <div className="space-y-4">
          {/* Tags Section */}
          <div className="border border-[#1d8f89] rounded-lg overflow-hidden">
            <button
              onClick={() => setActiveSection(activeSection === 'tags' ? null : 'tags')}
              className="w-full px-4 py-3 flex justify-between items-center hover:bg-[#1d8f89]/20"
            >
              <span>get notified when {userToken.calculatedDisplayName} shares a specific tag</span>
              <ChevronDownIcon 
                className={classNames(
                  "w-5 h-5 transition-transform",
                  activeSection === 'tags' ? "transform rotate-180" : ""
                )}
              />
            </button>
            
            {activeSection === 'tags' && (
              <div className="p-4 border-t border-[#1d8f89] bg-[#1d8f89]/10">
                {selectedTag && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-300 mb-2">selected tag:</div>
                    <div className="flex items-center justify-between bg-[#1d8f89]/20 p-3 rounded-lg">
                      <span>{selectedTag.tag}</span>
                      {renderFollowButton(selectedTag.tag)}
                    </div>
                  </div>
                )}
                
                <div className="mt-4">
                  <div className="text-sm text-gray-300 mb-2">follow custom tag:</div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      placeholder="enter tag..."
                      disabled={isFollowLoading}
                      className={classNames(
                        "flex-1 px-3 py-2 bg-[#1d8f89]/20 rounded-md border border-[#1d8f89] focus:outline-none focus:border-white",
                        isFollowLoading && "opacity-50 cursor-not-allowed"
                      )}
                    />
                    {renderFollowButton(customTag)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Places Section */}
          <div className="border border-[#1d8f89] rounded-lg overflow-hidden">
            <button
              onClick={() => setActiveSection(activeSection === 'places' ? null : 'places')}
              className="w-full px-4 py-3 flex justify-between items-center hover:bg-[#1d8f89]/20"
            >
              <span>get notified when {userToken.calculatedDisplayName} is at a specific place</span>
              <ChevronDownIcon 
                className={classNames(
                  "w-5 h-5 transition-transform",
                  activeSection === 'places' ? "transform rotate-180" : ""
                )}
              />
            </button>
            
            {activeSection === 'places' && (
              <div className="p-4 border-t border-[#1d8f89] bg-[#1d8f89]/10">
                {selectedPlace && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-300 mb-2">selected place:</div>
                    <div className="flex items-center justify-between bg-[#1d8f89]/20 p-3 rounded-lg">
                      <span>{selectedPlace.text}</span>
                      {renderFollowButton(selectedPlace.text)}
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <div className="text-sm text-gray-300 mb-2">follow custom place:</div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customPlace}
                      onChange={(e) => setCustomPlace(e.target.value)}
                      placeholder="enter place..."
                      disabled={isFollowLoading}
                      className={classNames(
                        "flex-1 px-3 py-2 bg-[#1d8f89]/20 rounded-md border border-[#1d8f89] focus:outline-none focus:border-white",
                        isFollowLoading && "opacity-50 cursor-not-allowed"
                      )}
                    />
                    {renderFollowButton(customPlace)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Your Follows Section */}
          <div className="border border-[#1d8f89] rounded-lg overflow-hidden mt-4">
            <button
              onClick={() => setActiveSection(activeSection === 'follows' ? null : 'follows')}
              className="w-full px-4 py-3 flex justify-between items-center hover:bg-[#1d8f89]/20"
            >
              <span>view what you follow from {userToken.calculatedDisplayName}</span>
              <ChevronDownIcon 
                className={classNames(
                  "w-5 h-5 transition-transform",
                  activeSection === 'follows' ? "transform rotate-180" : ""
                )}
              />
            </button>
            
            {activeSection === 'follows' && (
              <div className="p-4 border-t border-[#1d8f89] bg-[#1d8f89]/10">
                {isFollowsLoading ? (
                  <div className="flex justify-center items-center py-4">
                    <CircleSpinner color="#1d8f89" bgcolor="white" />
                  </div>
                ) : followsData?.pages[0]?.length > 0 ? (
                  <div className="space-y-2">
                    {followsData.pages.map((page, i) => (
                      <div key={i}>
                        {page.map((follow) => (
                          <div 
                            key={follow.id}
                            className="flex items-center justify-between bg-[#1d8f89]/20 p-3 rounded-lg mb-1"
                          >
                            <span>{follow.eventNameFollowed}</span>
                            {renderFollowButton(follow.eventNameFollowed)}
                          </div>
                        ))}
                      </div>
                    ))}
                    
                    {hasNextPage && (
                      <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="w-full mt-4 px-4 py-2 bg-[#1d8f89]/20 hover:bg-[#1d8f89]/30 rounded-lg disabled:opacity-50"
                      >
                        {isFetchingNextPage ? 'Loading more...' : 'Load more'}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-400">
                    you don&apos;t follow anything from {userToken.calculatedDisplayName} yet
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
} 