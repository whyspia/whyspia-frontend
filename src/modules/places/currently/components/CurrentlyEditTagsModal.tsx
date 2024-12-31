"use client"

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Modal from 'components/modals/Modal'
import DropdownSelectMenu from 'modules/forms/components/DropdownSelectMenu'
import { 
  DURATION_OPTIONS, 
  ACTIVE_DURATION_OPTIONS,
  getDurationMs,
  getDurationOption,
  getShortDurationOptionName
} from '../types/durationTypes'
import { apiCreateCurrently, createTagsUpdate } from 'actions/currently/apiCreateCurrently'
import { updateTagText, updateTagDuration, deleteTag, apiUpdateCurrently } from 'actions/currently/apiUpdateCurrently'
import { CurrentlyTag } from '../types/apiCurrentlyTypes'

export default function CurrentlyEditTagsModal({
  close,
  onConfirm,
  currentTags,
  jwt
}: {
  close: () => void
  onConfirm: (tags: CurrentlyTag[]) => void
  currentTags: CurrentlyTag[]
  jwt: string
}) {
  const [inputTag, setInputTag] = useState('')
  const [inputDuration, setInputDuration] = useState<DURATION_OPTIONS>(DURATION_OPTIONS.END_OF_DAY)
  const [tagsWithDurations, setTagsWithDurations] = useState<CurrentlyTag[]>(
    currentTags && currentTags?.length > 0
      ? currentTags.map(tag => ({
          tag: tag.tag,
          duration: tag.duration,
          updatedDurationAt: tag.updatedDurationAt
        }))
      : []
  )

  const handleAddTag = () => {
    if (inputTag.trim() && inputDuration) {
      setTagsWithDurations([
        ...tagsWithDurations,
        {
          tag: inputTag.trim(),
          duration: getDurationMs(inputDuration),
          updatedDurationAt: new Date()
        }
      ])
      setInputTag('')
      setInputDuration(DURATION_OPTIONS.END_OF_DAY)
    }
  }

  const handleRemoveTag = (indexToRemove: number) => {
    setTagsWithDurations(tagsWithDurations.filter((_, index) => index !== indexToRemove))
  }

  const handleConfirm = async () => {
    if (tagsWithDurations.length === 0) {
      // If all tags were removed and there were previous tags, we need to delete them
      if (currentTags.length > 0) {
        const updates = currentTags.map(tag => deleteTag(tag.tag))
        const result = await apiUpdateCurrently({
          jwt,
          updates
        })
        if (!result) {
          toast.error('Failed to delete all tags')
          return
        }
      }
      onConfirm([])
      close()
      return
    }

    if (!currentTags.length) {
      // Creating new tags
      const result = await apiCreateCurrently({
        jwt,
        updates: createTagsUpdate(tagsWithDurations)
      })
      if (!result) {
        toast.error('Failed to create tags')
        return
      }
    } else {
      // Updating existing tags
      const updates = []
      
      // Handle deleted tags - now we handle all deletions at save time
      const deletedTags = currentTags.filter(
        oldTag => !tagsWithDurations.some(newTag => newTag.tag === oldTag.tag)
      )
      deletedTags.forEach(tag => {
        updates.push(deleteTag(tag.tag))
      })

      // Handle new and updated tags
      tagsWithDurations.forEach(tag => {
        const existingTag = currentTags.find(t => t.tag === tag.tag)
        if (!existingTag) {
          // This is a new tag
          updates.push(...createTagsUpdate([tag]))
        } else if (existingTag.duration !== tag.duration) {
          // Duration changed
          updates.push(updateTagDuration(tag.tag, tag.duration))
        }
      })
      
      if (updates.length > 0) {
        const result = await apiUpdateCurrently({
          jwt,
          updates
        })
        if (!result) {
          toast.error('Failed to update tags')
          return
        }
      }
    }

    onConfirm(tagsWithDurations)
    close()
  }

  const hasChanges = (): boolean => {
    if (currentTags.length !== tagsWithDurations.length) return true
    return tagsWithDurations.some((tag, index) => {
      const originalTag = currentTags[index]
      return tag.tag !== originalTag.tag || tag.duration !== originalTag.duration
    })
  }

  const canAddTag = inputTag.trim() && inputDuration
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
            className="w-full rounded-lg px-2 py-2"
          />

          <div>
            <label className="block text-sm mb-2">HOW LONG WILL THIS TAG BE ACTIVE (timer starts on save)</label>
            <DropdownSelectMenu 
              options={ACTIVE_DURATION_OPTIONS} 
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
              <span>{tag.tag}</span>
              <span className="mx-1 opacity-60">·</span>
              <span className="opacity-60">{getShortDurationOptionName(getDurationOption(tag.duration))}</span>
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
            className={`flex-1 px-4 py-2 text-white rounded-md border ${
              canConfirm
                ? 'bg-[#1d8f89] border-[#1d8f89] hover:border-white cursor-pointer'
                : 'bg-gray-500 border-gray-500 cursor-not-allowed opacity-50'
            }`}
          >
            save all tags
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
