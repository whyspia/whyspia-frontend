"use client"

import Modal from 'components/modals/Modal'
import { twitterLogin } from '../services/UserService'

export default function YouGottaLoginModal({
  close,
}: {
  close: () => void
}) {

  return (
    <Modal close={close}>
      <div className="p-6 w-96 md:w-[30rem] text-white">

        <div className="text-2xl font-bold">aye yo - you gotta login first</div>

        <div
          onClick={() => twitterLogin(null)}
          className="relative h-full z-[500] flex justify-center items-center px-4 py-2 ml-2 text-xs font-bold text-white rounded-xl bg-[#1DA1F2] rounded-xl cursor-pointer"
        >
          connect X
        </div>

      </div>
    </Modal>
  )
}
