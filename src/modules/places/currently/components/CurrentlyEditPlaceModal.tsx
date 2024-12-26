"use client"

import React, { useState } from 'react'
import Modal from 'components/modals/Modal'
import DropdownSelectMenu from 'modules/forms/components/DropdownSelectMenu'

enum PLACE_DURATION_OPTIONS {
  END_OF_DAY = 'until end of day',
  FOUR_HOURS = '4 hours',
  ONE_HOUR = '1 hour',
  DONT_CLEAR = 'until i change this again',
}

const ACTIVE_PLACE_DURATION_OPTIONS = [
  PLACE_DURATION_OPTIONS.END_OF_DAY,
  PLACE_DURATION_OPTIONS.FOUR_HOURS,
  PLACE_DURATION_OPTIONS.ONE_HOUR,
  PLACE_DURATION_OPTIONS.DONT_CLEAR,
]

export default function CurrentlyEditPlaceModal({
  close,
  onConfirm,
  currentPlace,
}: {
  close: () => void
  onConfirm: (inputPlace: string) => void
  currentPlace: string
}) {
  const [inputPlace, setInputPlace] = useState(currentPlace)
  const [placeDuration, setPlaceDuration] = useState<PLACE_DURATION_OPTIONS>(PLACE_DURATION_OPTIONS.END_OF_DAY)

  const handleConfirm = () => {
    onConfirm(inputPlace)
    close()
  }

  return (
    <Modal close={close}>
      <div className="p-6 w-full md:w-[30rem] text-white">
        <div className="mb-4 font-bold">PLACE: share where you are</div>
        
        <textarea
          value={inputPlace}
          onChange={(event) => setInputPlace(event.target.value)}
          placeholder="enter place..."
          className="w-full rounded-lg px-2 py-1"
        />

        <label className="block text-sm my-2">HOW LONG WILL YOU BE HERE (timer starts on confirm)</label>
        
        <DropdownSelectMenu options={ACTIVE_PLACE_DURATION_OPTIONS} selectedOption={placeDuration} setSelectedOption={setPlaceDuration as any} />

        <div className="flex space-x-2 mt-4">
          <button onClick={handleConfirm} className="px-4 py-2 bg-[#1d8f89] text-white rounded-md border border-[#1d8f89] hover:border-white">
            confirm
          </button>

          <button onClick={() => setInputPlace('')} className="px-4 py-2 bg-red-500 text-white rounded-md text-sm border border-red-500 hover:border-white">
            clear
          </button>
        </div>
      </div>
    </Modal>
  )
}
