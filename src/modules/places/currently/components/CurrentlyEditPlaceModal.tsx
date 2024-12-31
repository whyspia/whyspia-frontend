"use client"

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Modal from 'components/modals/Modal'
import DropdownSelectMenu from 'modules/forms/components/DropdownSelectMenu'
import { 
  DURATION_OPTIONS, 
  ACTIVE_DURATION_OPTIONS,
  PlaceWithDuration,
  getDurationMs,
  getDurationOption
} from '../types/durationTypes'
import { apiCreateCurrently, createPlaceUpdate } from 'actions/currently/apiCreateCurrently'
import { updatePlaceText, updatePlaceDuration, deletePlace, apiUpdateCurrently } from 'actions/currently/apiUpdateCurrently'
import { CurrentlyPlace } from '../types/apiCurrentlyTypes'

export default function CurrentlyEditPlaceModal({
  close,
  onConfirm,
  currentPlace,
  jwt
}: {
  close: () => void
  onConfirm: (place: CurrentlyPlace | null) => void
  currentPlace: CurrentlyPlace | null
  jwt: string
}) {
  const [inputPlace, setInputPlace] = useState(currentPlace?.text || '')
  const [inputDuration, setInputDuration] = useState<DURATION_OPTIONS>(
    currentPlace 
      ? getDurationOption(currentPlace.duration)
      : DURATION_OPTIONS.END_OF_DAY
  )

  const handleConfirm = async () => {
    if (!inputPlace.trim()) {
      // If they cleared the text, treat as delete
      if (currentPlace) {
        const result = await apiUpdateCurrently({
          jwt,
          updates: [deletePlace()]
        })
        if (!result) {
          toast.error('Failed to delete place')
          return
        }
        onConfirm(null)
      }
      close()
      return
    }

    const newPlace: CurrentlyPlace = {
      text: inputPlace.trim(),
      duration: getDurationMs(inputDuration),
      updatedDurationAt: new Date() // only used for frontend
    }

    if (!currentPlace) {
      // Creating new place
      const result = await apiCreateCurrently({
        jwt,
        updates: [createPlaceUpdate(newPlace)]
      })
      if (!result) {
        toast.error('Failed to create new place')
        return
      }
    } else {
      // Updating existing place
      const updates = []
      if (currentPlace.text !== newPlace.text) {
        updates.push(updatePlaceText(newPlace.text))
      }
      if (currentPlace.duration !== newPlace.duration) {
        updates.push(updatePlaceDuration(newPlace.duration))
      }
      
      if (updates.length > 0) {
        const result = await apiUpdateCurrently({
          jwt,
          updates
        })
        if (!result) {
          toast.error('Failed to update place')
          return
        }
      }
    }

    onConfirm(newPlace)
    close()
  }

  const handleDelete = async () => {
    if (currentPlace) {
      const result = await apiUpdateCurrently({
        jwt,
        updates: [deletePlace()]
      })
      if (!result) {
        toast.error('Failed to delete place')
        return
      }
      onConfirm(null)
      close()
    }
  }

  const hasChanges = currentPlace?.text !== inputPlace || getDurationOption(currentPlace?.duration) !== inputDuration
  const canConfirm = inputPlace.trim() && hasChanges

  return (
    <Modal close={close}>
      <div className="p-6 w-full md:w-[30rem] text-white">
        <div className="mb-4 font-bold">PLACE: share where you are</div>
        
        <div className="space-y-4">
          <textarea
            value={inputPlace}
            onChange={(event) => setInputPlace(event.target.value)}
            placeholder="enter place..."
            className="w-full rounded-lg px-2 py-1"
          />

          <div>
            <label className="block text-sm my-2">HOW LONG WILL YOU BE HERE (timer starts on save)</label>
            <DropdownSelectMenu 
              options={ACTIVE_DURATION_OPTIONS} 
              selectedOption={inputDuration} 
              setSelectedOption={setInputDuration as any} 
            />
          </div>

          <div className="flex space-x-2 mt-4">
            <button 
              onClick={handleConfirm}
              disabled={!canConfirm}
              className={`flex-1 px-4 py-2 text-white rounded-md border ${
                canConfirm
                  ? 'bg-[#1d8f89] border-[#1d8f89] hover:border-white cursor-pointer'
                  : 'bg-gray-500 border-gray-500 cursor-not-allowed opacity-50'
              }`}
            >
              save place
            </button>

            <button 
              onClick={() => setInputPlace('')} 
              className="px-4 py-2 bg-gray-500 text-white rounded-md text-sm border border-gray-500 hover:border-white"
            >
              clear
            </button>

            {currentPlace && (
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md text-sm border border-red-500 hover:border-white"
              >
                delete and save
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}
