"use client"

import React, { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import Modal from 'components/modals/Modal'
import DropdownSelectMenu from 'modules/forms/components/DropdownSelectMenu'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { 
  DURATION_OPTIONS, 
  ACTIVE_DURATION_OPTIONS,
  getDurationMs,
  getDurationOption
} from '../types/durationTypes'
import { apiCreateCurrently, createPlaceUpdate } from 'actions/currently/apiCreateCurrently'
import { updatePlaceText, updatePlaceDuration, deletePlace, apiUpdateCurrently } from 'actions/currently/apiUpdateCurrently'
import { CurrentlyPlace } from '../types/apiCurrentlyTypes'

interface CurrentlyEditPlaceModalProps {
  close: () => void
  onConfirm: (place: CurrentlyPlace | null) => void
  currentPlace: CurrentlyPlace | null
  jwt: string
  isAnyFieldActive: boolean
}

export default function CurrentlyEditPlaceModal({
  close,
  onConfirm,
  currentPlace,
  jwt,
  isAnyFieldActive
}: CurrentlyEditPlaceModalProps) {
  const [inputPlace, setInputPlace] = useState(currentPlace?.text || '')
  const [inputDuration, setInputDuration] = useState<DURATION_OPTIONS>(
    currentPlace 
      ? getDurationOption(currentPlace.duration)
      : DURATION_OPTIONS.END_OF_DAY
  )
  const [shouldSavePlace, setShouldSavePlace] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const toggleTooltip = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault() // Prevent any default touch/click behavior
    setShowTooltip(prev => !prev)
  }, [])

  const handleConfirm = async () => {
    // If they cleared the text, treat as delete
    if (!inputPlace.trim()) {
      if (currentPlace) {
        const result = await apiUpdateCurrently({
          jwt,
          updates: [deletePlace()]
        })
        if (!result) {
          toast.error('failed to leave place')
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

    // If we have an active record, always use update
    if (isAnyFieldActive) {
      if (currentPlace) {
        // Updating existing place - only update what changed
        const updates = []
        if (currentPlace.text !== newPlace.text) {
          updates.push(updatePlaceText(newPlace.text, shouldSavePlace))
        }
        if (currentPlace.duration !== newPlace.duration) {
          updates.push(updatePlaceDuration(newPlace.duration, shouldSavePlace))
        }
        
        if (updates.length > 0) {
          const result = await apiUpdateCurrently({
            jwt,
            updates,
          })
          if (!result) {
            toast.error('failed to update place')
            return
          }
        }
      } else {
        // Creating new place while other fields exist
        const result = await apiUpdateCurrently({
          jwt,
          updates: [createPlaceUpdate(newPlace, shouldSavePlace)]
        })
        if (!result) {
          toast.error('failed to update place')
          return
        }
      }
    } else {
      // No active fields, create new record
      const result = await apiCreateCurrently({
        jwt,
        updates: [createPlaceUpdate(newPlace, shouldSavePlace)]
      })
      if (!result) {
        toast.error('failed going to place')
        return
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
        toast.error('failed to leave place')
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
            <label className="block text-sm my-2">HOW LONG WILL YOU BE HERE (timer starts on share)</label>
            <DropdownSelectMenu 
              options={ACTIVE_DURATION_OPTIONS} 
              selectedOption={inputDuration} 
              setSelectedOption={setInputDuration as any} 
            />
          </div>

          {/* <div className="relative flex items-center space-x-2">
            <input
              type="checkbox"
              checked={shouldSavePlace}
              onChange={(e) => setShouldSavePlace(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#1d8f89] focus:ring-[#1d8f89]"
            />
            <label className="text-sm">save this place</label>
            <div 
              className="relative inline-block"
              onClick={toggleTooltip}
              onTouchEnd={toggleTooltip}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <InformationCircleIcon className="w-5 h-5 text-gray-400 cursor-pointer" />
              {showTooltip && (
                <div 
                  className="fixed inset-0 z-50 flex items-center justify-center md:relative md:inset-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="fixed inset-0 bg-black/50 md:hidden" onClick={() => setShowTooltip(false)} />
                  <div className="relative bg-gray-800 text-white p-4 rounded-lg w-[80%] md:w-64 md:absolute md:bottom-full md:left-1/2 md:transform md:-translate-x-1/2 md:mb-2 md:p-2 shadow-lg">
                    <div className="text-left text-xs">
                      1. your saved places are displayed to others for them to follow
                      <br />
                      2. quickly reuse saved places instead of typing again
                    </div>
                    <div className="hidden md:block absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45" />
                    <button 
                      onClick={() => setShowTooltip(false)}
                      className="absolute top-2 right-2 text-white md:hidden"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div> */}

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
              share place
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
                leave current place
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}
