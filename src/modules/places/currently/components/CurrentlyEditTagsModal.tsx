"use client"

import React, { useState } from 'react'
import Modal from 'components/modals/Modal'

export default function CurrentlyEditTagsModal({
  close,
  onConfirm,
  currentTags,
}: {
  close: () => void
  onConfirm: (tags: string[]) => void
  currentTags: string[]
}) {
  const [inputTag, setInputTag] = useState('')
  const [tags, setTags] = useState<string[]>(currentTags)

  const handleAddTag = () => {
    if (inputTag.trim()) {
      setTags([...tags, inputTag.trim()])
      setInputTag('')
    }
  }

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove))
  }

  const handleConfirm = () => {
    onConfirm(tags)
    close()
  }

  return (
    <Modal close={close}>
      <div className="p-6 w-full md:w-[30rem] text-white">
        <div className="mb-4 font-bold">WANT_YOU_TO_KNOW_TAGS: share tags signalling what you want others to know</div>
        
        <div className="flex space-x-2 mb-4">
          <input
            value={inputTag}
            onChange={(event) => setInputTag(event.target.value)}
            placeholder="enter tag..."
            className="flex-1 rounded-lg px-2 py-1"
          />
          <button 
            onClick={handleAddTag}
            className="px-4 py-2 bg-[#1d8f89] text-white rounded-md border border-[#1d8f89] hover:border-white"
          >
            add tag
          </button>
        </div>

        <div className="mb-4">
          {tags.map((tag, index) => (
            <div key={index} className="inline-block bg-[#1d8f89] rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
              {tag}
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
            className="px-4 py-2 bg-[#1d8f89] text-white rounded-md border border-[#1d8f89] hover:border-white"
          >
            confirm all tags
          </button>

          <button 
            onClick={() => setTags([])} 
            className="px-4 py-2 bg-red-500 text-white rounded-md text-sm border border-red-500 hover:border-white"
          >
            clear all
          </button>
        </div>
      </div>
    </Modal>
  )
}
