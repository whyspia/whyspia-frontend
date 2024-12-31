"use client"

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Modal from 'components/modals/Modal'
import DropdownSelectMenu from 'modules/forms/components/DropdownSelectMenu'
import { 
  DURATION_OPTIONS, 
  ACTIVE_DURATION_OPTIONS,
  getDurationMs,
  getDurationOption
} from '../types/durationTypes'
import { apiCreateCurrently, createStatusUpdate } from 'actions/currently/apiCreateCurrently'
import { updateStatusText, updateStatusDuration, deleteStatus, apiUpdateCurrently } from 'actions/currently/apiUpdateCurrently'
import { CurrentlyStatus } from '../types/apiCurrentlyTypes'

export default function CurrentlyEditStatusModal({
  close,
  onConfirm,
  currentStatus,
  jwt
}: {
  close: () => void
  onConfirm: (status: CurrentlyStatus | null) => void
  currentStatus: CurrentlyStatus | null
  jwt: string
}) {
  const [inputStatus, setInputStatus] = useState(currentStatus?.text || '')
  const [inputDuration, setInputDuration] = useState<DURATION_OPTIONS>(
    currentStatus 
      ? getDurationOption(currentStatus.duration)
      : DURATION_OPTIONS.END_OF_DAY
  )

  const handleConfirm = async () => {
    if (!inputStatus.trim()) {
      // If they cleared the text, treat as delete
      if (currentStatus) {
        const result = await apiUpdateCurrently({
          jwt,
          updates: [deleteStatus()]
        })
        if (!result) {
          toast.error('Failed to delete status')
          return
        }
        onConfirm(null)
      }
      close()
      return
    }

    const newStatus: CurrentlyStatus = {
      text: inputStatus.trim(),
      duration: getDurationMs(inputDuration),
      updatedDurationAt: new Date() // only used for frontend
    }

    if (!currentStatus) {
      // Creating new status
      const result = await apiCreateCurrently({
        jwt,
        updates: [createStatusUpdate(newStatus)]
      })
      if (!result) {
        toast.error('Failed to create new status')
        return
      }
    } else {
      // Updating existing status
      const updates = []
      if (currentStatus.text !== newStatus.text) {
        updates.push(updateStatusText(newStatus.text))
      }
      if (currentStatus.duration !== newStatus.duration) {
        updates.push(updateStatusDuration(newStatus.duration))
      }
      
      if (updates.length > 0) {
        const result = await apiUpdateCurrently({
          jwt,
          updates
        })
        if (!result) {
          toast.error('Failed to update status')
          return
        }
      }
    }

    onConfirm(newStatus)
    close()
  }

  const handleDelete = async () => {
    if (currentStatus) {
      const result = await apiUpdateCurrently({
        jwt,
        updates: [deleteStatus()]
      })
      if (!result) {
        toast.error('Failed to delete status')
        return
      }
      onConfirm(null)
      close()
    }
  }

  const hasChanges = currentStatus?.text !== inputStatus || getDurationOption(currentStatus?.duration) !== inputDuration
  const canConfirm = inputStatus.trim() && hasChanges

  return (
    <Modal close={close}>
      <div className="p-6 w-full md:w-[30rem] text-white">
        <div className="mb-4 font-bold">STATUS: share a status saying whatever</div>
        
        <div className="space-y-4">
          <textarea
            value={inputStatus}
            onChange={(event) => setInputStatus(event.target.value)}
            placeholder="enter status..."
            className="w-full rounded-lg px-2 py-1"
          />

          <div>
            <label className="block text-sm my-2">HOW LONG TO SHARE STATUS FOR (timer starts on save)</label>
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
              save status
            </button>

            <button 
              onClick={() => setInputStatus('')} 
              className="px-4 py-2 bg-gray-500 text-white rounded-md text-sm border border-gray-500 hover:border-white"
            >
              clear
            </button>

            {currentStatus && (
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
