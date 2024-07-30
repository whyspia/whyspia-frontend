import DefaultLayout from 'components/layouts/DefaultLayout'
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/solid"
import { EMOTE_CONTEXTS_ACTIVE, getContextSummary } from 'modules/context/utils/ContextUtils'
import type { NextPage } from 'next'
import { useState } from 'react'

const AboutHome: NextPage = () => {
  const [isContextSummsDropdownOpen, setIsContextSummsDropdownOpen] = useState(false)
  const [isTermsDropdownOpen, setIsTermsDropdownOpen] = useState(false)

  return (
    <div className="md:w-1/2 w-full mx-auto relative z-40">

      <div className="text-2xl font-bold text-center">what the heck is this?</div>

      <div className="mt-6">

        <div className="mb-4 ">
          good question. this website is a mix between emote protocol and whyspia based on terms below
        </div>

      </div>

      <div className="mt-3">

        <button
          onClick={(event) => {
            event.stopPropagation()
            setIsTermsDropdownOpen(!isTermsDropdownOpen)
          }}
          className="flex items-center py-2 px-4 rounded-md border border-purple-500 w-full"
        >
          <div>terms:</div>
          {isTermsDropdownOpen ? (
            <ChevronUpIcon className="w-5 h-5 ml-2" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 ml-2" />
          )}
        </button>

        {isTermsDropdownOpen && (
          <ul className="ml-10 list-disc mt-4">
            <li className="mb-2">
              <span className="font-bold mb-2">emote (as a noun) #1</span>: sender(s), receiver(s), symbol(s), timeSent, id
            </li>
            <li className="mb-2">
              <span className="font-bold mb-2">emote (as a noun) #2</span>: a sent symbol (with metadata)
            </li>
            <li className="mb-2">
              <span className="font-bold mb-2">emote (as a verb)</span>: to send symbol(s) to receiver(s)
            </li>
            <li className="mb-2">
              <span className="font-bold mb-2">emote protocol</span>: protocol for understanding and transparency. basically: you send symbols to receivers. a symbol is any text (like the text "hug"). at the lowest level, this is about symbols being sent. but that is kinda boring. so, contexts abstract this away and add more fun and functionality - it&apos;s no longer about sending symbols, instead it&apos;s about whatever the story of the context is. if the data is public, it helps with understanding and transparency. another key point is that the system is built so that even if all computation of apps stopped, you could view your data in files and everything would still make sense with emote format (compared to most data that isnt readable)
            </li>
            <li className="mb-2">
              <span className="font-bold mb-2">context</span>: in the emote protocol, a context is specific data/symbols that define logic for some app/computation. in whyspia, a context is basically an app or a world, but doesnt have to be defined by specific data/symbols
            </li>
            <li className="mb-2">
              <span className="font-bold mb-2">whyspia</span>: sanctuary for shared whispers of the soul to echo in flux. initially being manifested by shmoji as he tries to build all the things he feels called to build + art
            </li>
          </ul>
        )}

      </div>

      <div className="mt-3">

        <button
          onClick={(event) => {
            event.stopPropagation()
            setIsContextSummsDropdownOpen(!isContextSummsDropdownOpen)
          }}
          className="flex items-center py-2 px-4 rounded-md border border-purple-500 w-full"
        >
          <div>context summaries:</div>
          {isContextSummsDropdownOpen ? (
            <ChevronUpIcon className="w-5 h-5 ml-2" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 ml-2" />
          )}
        </button>

        {isContextSummsDropdownOpen && (
          <ul className="ml-10 list-disc mt-4">
            {Object.values(EMOTE_CONTEXTS_ACTIVE).map((c) => (
              <li key={c} className="mb-2">
                <span className="font-bold">{c}</span>: {getContextSummary(c)}
              </li>
            ))}
          </ul>
        )}

      </div>

    </div>
  )
}

(AboutHome as any).layoutProps = {
  Layout: DefaultLayout,
}

export default AboutHome
