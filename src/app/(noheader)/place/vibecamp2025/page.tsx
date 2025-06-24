"use client"

import { useState, useEffect } from 'react'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import ModalService from 'components/modals/ModalService'
import Modal from 'components/modals/Modal'

interface TopicCard {
  id: string
  contact: string
  topic: string
  additional?: string
  createdAt: Date
  updatedAt: Date
}

const ShareTopicModal = ({ close, onTopicCreated }: { close: () => void, onTopicCreated: (topic: TopicCard) => void }) => {
  const [newTopic, setNewTopic] = useState({
    contact: '',
    topic: '',
    additional: ''
  })
  const [showAdditional, setShowAdditional] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newTopicCard: TopicCard = {
      id: Date.now().toString(),
      ...newTopic,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    onTopicCreated(newTopicCard)
    close()
  }

  return (
    <Modal close={close}>
      <div className="bg-dark3 p-4 sm:p-6 rounded-lg w-full max-w-md text-white">
        <h2 className="text-xl font-bold mb-4">share topic</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <label className="text-gray-400">contact method</label>
              <div className="relative group">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 cursor-help">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-dark1 text-white text-sm rounded-lg shadow-lg border border-[#1d8f89]">
                  contact method can be what you think is best. Put twitter name, Discord name, that you are the person in the red hat, or whatever you think is best!
                </div>
              </div>
            </div>
            <input
              type="text"
              value={newTopic.contact}
              onChange={(e) => setNewTopic({...newTopic, contact: e.target.value})}
              placeholder="how can people reach you?"
              required
              className="w-full px-4 py-2 bg-dark1 text-white border border-[#1d8f89] rounded-lg focus:outline-none focus:border-white"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">topic</label>
            <input
              type="text"
              value={newTopic.topic}
              onChange={(e) => setNewTopic({...newTopic, topic: e.target.value})}
              placeholder="what do you want to talk about?"
              required
              className="w-full px-4 py-2 bg-dark1 text-white border border-[#1d8f89] rounded-lg focus:outline-none focus:border-white"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                id="showAdditional"
                checked={showAdditional}
                onChange={(e) => setShowAdditional(e.target.checked)}
                className="rounded text-blue-500"
              />
              <label htmlFor="showAdditional" className="text-white">add additional info (optional)</label>
            </div>

            {showAdditional && (
              <div className="mb-2">
                <textarea
                  value={newTopic.additional}
                  onChange={(e) => setNewTopic({...newTopic, additional: e.target.value})}
                  placeholder="anything else you'd like to share?"
                  className="w-full px-4 py-2 bg-dark1 text-white border border-[#1d8f89] rounded-lg focus:outline-none focus:border-white"
                  rows={3}
                />
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={close}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#1d8f89] text-white rounded-lg hover:bg-[#1d8f89]/80"
            >
              share
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default function Vibecamp2025Page() {
  const [searchQuery, setSearchQuery] = useState('')
  const [topics, setTopics] = useState<TopicCard[]>([])
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const ITEMS_PER_PAGE = 5

  // Load topics with pagination
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setIsLoading(true)
        const skip = (page - 1) * ITEMS_PER_PAGE
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_HOST}/vibecamp-topic?limit=${ITEMS_PER_PAGE}&skip=${skip}`
        )
        const data = await response.json()
        if (data.success) {
          if (page === 1) {
            setTopics(data.data.topics)
          } else {
            setTopics(prevTopics => [...prevTopics, ...data.data.topics])
          }
          setHasMore(data.data.topics.length === ITEMS_PER_PAGE)
        } else {
          setError('Failed to load topics')
        }
      } catch (error) {
        console.error('Error loading topics:', error)
        setError('Failed to load topics')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTopics()
  }, [page])

  // Reset pagination when search query changes
  useEffect(() => {
    setPage(1)
    setHasMore(true)
  }, [searchQuery])

  const filteredTopics = topics.filter(topic => 
    topic.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (topic.additional && topic.additional.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-dark1">
      {/* Deprecation Banner */}
      <div className="w-full max-w-2xl mb-6 p-4 bg-yellow-500/20 border border-yellow-500 rounded-lg text-yellow-500 text-center">
        <div className="font-bold text-lg mb-1">DEPRECATED</div>
        <div className="text-sm">This app is no longer active. You can view topics posted during VC2025 but cannot add new ones.</div>
      </div>

      <h1 className="text-xl md:text-2xl font-bold text-white mb-6 text-center">
        share niche topics you want to talk about during Vibecamp 2025
      </h1>

      {error && (
        <div className="w-full max-w-2xl mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-500">
          {error}
        </div>
      )}

      <div className="w-full max-w-2xl space-y-4 mb-14">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => ModalService.open(ShareTopicModal, {
              onTopicCreated: (topic) => {
                // No longer adding to socket - just close modal
                console.log('Topic creation disabled - feature deprecated')
              }
            })}
            className="w-full sm:w-auto px-4 py-2 bg-[#1d8f89] text-white rounded-lg hover:bg-[#1d8f89]/80 flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
            disabled
          >
            <PlusCircleIcon className="w-5 h-5" />
            share topic (disabled)
          </button>
          <input
            type="text"
            placeholder="search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-dark3 text-white border border-[#1d8f89] rounded-lg focus:outline-none focus:border-white"
          />
        </div>

        <div className="grid gap-3">
          {filteredTopics.map(topic => (
            <div
              key={topic.id}
              className="p-4 bg-[#1d8f89]/50 rounded-lg"
            >
              <div className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider shrink-0">contact method</span>
                  <span className="text-white font-medium break-words">{topic.contact}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider shrink-0">topic</span>
                  <span className="text-white text-lg font-semibold break-words">{topic.topic}</span>
                </div>
                {topic.additional && (
                  <div className="text-gray-300 text-sm break-words">{topic.additional}</div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {hasMore && !isLoading && (
          <button
            onClick={() => setPage(prev => prev + 1)}
            className="w-full px-4 py-2 bg-[#1d8f89]/30 text-white rounded-lg hover:bg-[#1d8f89]/40 transition-colors"
          >
            Show More
          </button>
        )}
        
        {isLoading && (
          <div className="text-center text-gray-400 py-4">
            loading more topics...
          </div>
        )}
      </div>
    </main>
  )
} 