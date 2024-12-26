"use client"

import React, { useState } from 'react'
import Modal from 'components/modals/Modal'
import DropdownSelectMenu from 'modules/forms/components/DropdownSelectMenu'
import { 
  TAG_DURATION_OPTIONS, 
  ACTIVE_TAG_DURATION_OPTIONS, 
  getShortDuration,
  TagWithDuration 
} from '../types/tagDurationTypes'

export default function CurrentlyEditTagsModal({
  close,
  onConfirm,
  currentTags,
}: {
  close: () => void
  onConfirm: (tags: TagWithDuration[]) => void
  currentTags: TagWithDuration[]
}) {
  const [inputTag, setInputTag] = useState('')
  const [inputDuration, setInputDuration] = useState<TAG_DURATION_OPTIONS>(TAG_DURATION_OPTIONS.END_OF_DAY)
  const [tagsWithDurations, setTagsWithDurations] = useState<TagWithDuration[]>(
    currentTags && currentTags?.length > 0
      ? currentTags.map(tag => ({
        text: tag?.text,
        duration: tag?.duration,
      }))
      : []
  )

  const handleAddTag = () => {
    if (inputTag.trim() && inputDuration) {
      setTagsWithDurations([
        ...tagsWithDurations,
        {
          text: inputTag.trim(),
          duration: inputDuration
        }
      ])
      setInputTag('')
      setInputDuration(TAG_DURATION_OPTIONS.END_OF_DAY)
    }
  }

  const handleRemoveTag = (indexToRemove: number) => {
    setTagsWithDurations(tagsWithDurations.filter((_, index) => index !== indexToRemove))
  }

  const handleUpdateDuration = (index: number, newDuration: TAG_DURATION_OPTIONS) => {
    setTagsWithDurations(tagsWithDurations.map((tag, i) => 
      i === index ? { ...tag, duration: newDuration } : tag
    ))
  }

  const handleConfirm = () => {
    onConfirm(tagsWithDurations)
    close()
  }

  const canAddTag = inputTag.trim() && inputDuration

  const hasChanges = (): boolean => {
    // Case 1: No currentTags, but we have new tags
    if (!currentTags?.length) {
      return tagsWithDurations.length > 0
    }

    // Case 2: Different number of tags
    if (currentTags.length !== tagsWithDurations.length) {
      return true
    }

    // Case 3: Same number of tags, check for any differences
    return tagsWithDurations.some((tag, index) => {
      const originalTag = currentTags[index]
      return tag.text !== originalTag.text || tag.duration !== originalTag.duration
    })
  }

  const canConfirm = hasChanges()

  return (
    <Modal close={close}>
      <div className="p-6 w-full md:w-[30rem] text-white">
        <div className="mb-4 font-bold">WANT_YOU_TO_KNOW_TAGS: share tags signalling what you want others to know</div>
        
        <div className="space-y-4 mb-4">
          <input
            value={inputTag}
            onChange={(event) => setInputTag(event.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && canAddTag && handleAddTag()}
            placeholder="enter tag..."
            className="w-full rounded-lg px-2 py-1"
          />

          <div>
            <label className="block text-sm mb-2">HOW LONG WILL THIS TAG BE ACTIVE</label>
            <DropdownSelectMenu 
              options={ACTIVE_TAG_DURATION_OPTIONS} 
              selectedOption={inputDuration} 
              setSelectedOption={setInputDuration as any} 
            />
          </div>

          <button 
            onClick={handleAddTag}
            disabled={!canAddTag}
            className={`w-full px-4 py-2 text-white rounded-md border ${
              canAddTag 
                ? 'bg-[#1d8f89] border-[#1d8f89] hover:border-white cursor-pointer' 
                : 'bg-gray-500 border-gray-500 cursor-not-allowed opacity-50'
            }`}
          >
            add tag
          </button>
        </div>

        <div className="mb-4">
          {tagsWithDurations.map((tag, index) => (
            <div key={index} className="inline-block bg-[#1d8f89] rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
              <span>{tag.text}</span>
              <span className="mx-1 opacity-60">·</span>
              <span className="opacity-60">{getShortDuration(tag.duration)}</span>
              <button
                onClick={() => handleRemoveTag(index)}
                className="ml-2 hover:text-red-500"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="flex space-x-2 mt-4">
          <button 
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={`px-4 py-2 text-white rounded-md border ${
              canConfirm
                ? 'bg-[#1d8f89] border-[#1d8f89] hover:border-white cursor-pointer'
                : 'bg-gray-500 border-gray-500 cursor-not-allowed opacity-50'
            }`}
          >
            confirm all tags
          </button>

          <button 
            onClick={() => setTagsWithDurations([])} 
            className="px-4 py-2 bg-red-500 text-white rounded-md text-sm border border-red-500 hover:border-white"
          >
            clear all
          </button>
        </div>
      </div>
    </Modal>
  )
}
