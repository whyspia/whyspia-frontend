import Modal from 'components/modals/Modal'
import classNames from 'classnames'
import A from 'components/A'
import { EmoteNotifSingleResponse } from 'actions/notifs/apiGetAllEmoteNotifs'
import PersonClickModal from 'modules/users/components/PersonClickModal'
import ModalService from 'components/modals/ModalService'
import { getDisplayTimeLeft } from 'modules/places/currently/types/durationTypes'
import CurrentlyFollowModal from 'modules/places/currently/components/CurrentlyFollowModal'
import { CurrentlyResponse } from '../types/apiCurrentlyTypes'

export default function CurrentlyNotifReactModal({
  close,
  notif,
}: {
  close: () => void
  notif: EmoteNotifSingleResponse
}) {
  const onOptionSelected = (option: string) => {
    close()
  }

  const currently = notif?.notifData as CurrentlyResponse

  return (
    <Modal close={close}>
      <div className="p-6 w-96 md:w-[30rem] text-white">
        <div className="relative group pointer-events-none">

          <div className="p-6 border-2 border-white rounded-2xl group/main relative">
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

        <div className="flex flex-wrap justify-center mt-6">
          <A
            onClick={() => onOptionSelected('home')}
            href={`/place/currently`}
            className={classNames(
              'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer'
            )}
          >
            go to currently
          </A>
        </div>
      </div>
    </Modal>
  )
}
