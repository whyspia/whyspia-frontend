"use client"

import toast from 'react-hot-toast'
import { flatten } from 'lodash'
import { useContext, useState, useEffect } from 'react'
import { useInfiniteQuery, useQueryClient, useQuery } from 'react-query'
import { GlobalContext } from 'lib/GlobalContext'
import classNames from 'classnames'
import A from 'components/A'
import ModalService from 'components/modals/ModalService'
import useAuth from 'modules/users/hooks/useAuth'
import PersonClickModal from 'modules/users/components/PersonClickModal'
import { SavedPerson, UserV2PublicProfile } from 'modules/users/types/UserNameTypes'
import ChoosePersonButton from 'modules/users/components/ChoosePersonButton'
import CurrentlyEditPlaceModal from 'modules/places/currently/components/CurrentlyEditPlaceModal'
import CurrentlyEditStatusModal from 'modules/places/currently/components/CurrentlyEditStatusModal'
import CurrentlyEditTagsModal from 'modules/places/currently/components/CurrentlyEditTagsModal'
import { 
  TagWithDuration, 
  getShortDurationOptionName,
  PlaceWithDuration,
  StatusWithDuration,
  getDurationOption
} from 'modules/places/currently/types/durationTypes'
import { apiGetCurrentlySingleWithAnyActiveField } from 'actions/currently/apiGetCurrentlySingle'
import { CurrentlyResponse, CurrentlyPlace, CurrentlyTag, CurrentlyStatus } from 'modules/places/currently/types/apiCurrentlyTypes'
import { DURATION_OPTIONS } from 'modules/places/currently/types/durationTypes'


const CurrentlyPage = () => {
  const { jwtToken, userV2: loggedInUser } = useContext(GlobalContext)
  const { handleParticleAndWhyspiaLogin } = useAuth()

  const [inputPlace, setInputPlace] = useState<CurrentlyPlace | null>(null)
  const [inputTags, setInputTags] = useState<CurrentlyTag[]>([])
  const [inputStatus, setInputStatus] = useState<CurrentlyStatus | null>(null)

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

  return (
    <div className="h-screen flex flex-col items-center mt-4 px-4">

      <div className="md:w-[37rem] w-full flex flex-col justify-center items-center">

        <div className="text-lg md:text-3xl font-bold mb-8">
          CURRENTLY: share with others what is current for you
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

              <div className="w-full flex justify-between mb-8">
                <button
                  onClick={() => ModalService.open(CurrentlyEditPlaceModal, { 
                    onConfirm: setInputPlace, 
                    currentPlace: inputPlace,
                    jwt: jwtToken 
                  })}
                  className={classNames(
                    "px-4 py-2 bg-[#1d8f89] border border-[#1d8f89] hover:border-white disabled:opacity-50 text-white rounded-md"
                  )}
                >
                  {inputPlace ? 'edit' : 'add'} PLACE
                </button>
                <button
                  onClick={() => ModalService.open(CurrentlyEditTagsModal, { 
                    onConfirm: setInputTags, 
                    currentTags: inputTags,
                    jwt: jwtToken 
                  })}
                  className={classNames(
                    "px-4 py-2 bg-[#1d8f89] border border-[#1d8f89] hover:border-white disabled:opacity-50 text-white rounded-md"
                  )}
                >
                  {inputTags.length > 0 ? 'edit' : 'add'} WANT_YOU_TO_KNOW_TAGS
                </button>
                <button
                  onClick={() => ModalService.open(CurrentlyEditStatusModal, { 
                    onConfirm: setInputStatus, 
                    currentStatus: inputStatus,
                    jwt: jwtToken 
                  })}
                  className={classNames(
                    "px-4 py-2 bg-[#1d8f89] border border-[#1d8f89] hover:border-white disabled:opacity-50 text-white rounded-md"
                  )}
                >
                  {inputStatus ? 'edit' : 'add'} STATUS
                </button>
              </div>

              <div className="w-full">
                <div className="font-bold text-lg mb-2">PUBLIC VIEW:</div>
                
                <div className="p-6 border-2 border-white rounded-2xl">
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
                    <div className="mt-2 p-4 bg-[#1d8f89]/50 rounded-lg relative">
                      <div className="absolute top-0 right-0 text-xs rounded-tr-lg rounded-bl-lg" style={{ background: 'rgb(29 143 137)' }}>
                        <div className="bg-[#1d8f89] px-3 py-1 rounded-tr-lg rounded-bl-lg">
                          {getShortDurationOptionName(getDurationOption(inputPlace.duration))}
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
                          <div key={index} className="inline-block bg-[#1d8f89] rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
                            <span>{tag.tag}</span>
                            <span className="mx-1 opacity-60">·</span>
                            <span className="opacity-60">{getShortDurationOptionName(getDurationOption(tag.duration))}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {inputStatus && (
                    <div className="mt-2 p-4 bg-[#1d8f89]/50 rounded-lg relative">
                      <div className="absolute top-0 right-0 text-xs rounded-tr-lg rounded-bl-lg" style={{ background: 'rgb(29 143 137)' }}>
                        <div className="bg-[#1d8f89] px-3 py-1 rounded-tr-lg rounded-bl-lg">
                          {getShortDurationOptionName(getDurationOption(inputStatus.duration))}
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

            </div>
          )}

          
        </>

      </div>
    </div>
  )
}

export default CurrentlyPage