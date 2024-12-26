"use client"

import React, { useState } from 'react'
import Modal from 'components/modals/Modal'
import DropdownSelectMenu from 'modules/forms/components/DropdownSelectMenu'

enum STATUS_DURATION_OPTIONS {
  END_OF_DAY = 'until end of day',
  FOUR_HOURS = '4 hours',
  ONE_HOUR = '1 hour',
  DONT_CLEAR = 'until i change this again',
}

const ACTIVE_STATUS_DURATION_OPTIONS = [
  STATUS_DURATION_OPTIONS.END_OF_DAY,
  STATUS_DURATION_OPTIONS.FOUR_HOURS,
  STATUS_DURATION_OPTIONS.ONE_HOUR,
  STATUS_DURATION_OPTIONS.DONT_CLEAR,
]

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
  const [statusDuration, setStatusDuration] = useState<STATUS_DURATION_OPTIONS>(STATUS_DURATION_OPTIONS.END_OF_DAY)


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

        <label className="block text-sm my-2">HOW LONG TO SHARE STATUS FOR (timer starts on confirm)</label>
        
        <DropdownSelectMenu options={ACTIVE_STATUS_DURATION_OPTIONS} selectedOption={statusDuration} setSelectedOption={setStatusDuration as any} />

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
