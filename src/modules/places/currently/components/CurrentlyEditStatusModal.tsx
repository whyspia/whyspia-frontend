"use client"

import React, { useState } from 'react'
import Modal from 'components/modals/Modal'

export default function CurrentlyEditStatusModal({
  close,
  onConfirm,
  currentStatus,
}: {
  close: () => void
  onConfirm: (inputStatus: string) => void
  currentStatus: string
}) {
  const [inputStatus, setInputStatus] = useState(currentStatus)

  const handleConfirm = () => {
    onConfirm(inputStatus)
    close()
  }

  return (
    <Modal close={close}>
      <div className="p-6 w-full md:w-[30rem] text-white">
        <div className="mb-4 font-bold">STATUS: share a status saying whatever</div>
        
        <textarea
          value={inputStatus}
          onChange={(event) => setInputStatus(event.target.value)}
          placeholder="enter status..."
          className="w-full rounded-lg px-2 py-1"
        />

        <div className="flex space-x-2 mt-4">
          <button onClick={handleConfirm} className="px-4 py-2 bg-[#1d8f89] text-white rounded-md border border-[#1d8f89] hover:border-white">
            confirm
          </button>

          <button onClick={() => setInputStatus('')} className="px-4 py-2 bg-red-500 text-white rounded-md text-sm border border-red-500 hover:border-white">
            clear
          </button>
        </div>
      </div>
    </Modal>
  )
}
