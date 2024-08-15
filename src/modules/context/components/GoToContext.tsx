import classNames from "classnames"
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/solid"
import { EMOTE_CONTEXTS_ACTIVE, getContextPagePath, getContextSummary } from "../utils/ContextUtils"
import A from "components/A"
import { useState } from "react"


const GoToContext = () => {
  const [isContextSummsDropdownOpen, setIsContextSummsDropdownOpen] = useState(false)

  return (
    <>
      <div className="text-2xl font-bold mb-6">choose context to go to</div>

      <div className="mb-4 flex flex-wrap">
        {Object.values(EMOTE_CONTEXTS_ACTIVE).map((c) => (
          <A
            key={c}
            onClick={() => close()}
            href={getContextPagePath(c)}
            className={classNames(
              'p-3 mb-4 mr-2 bg-[#1d8f89] text-white rounded-lg hover:bg-[#1d8f89]/50 border border-white cursor-pointer'
            )}
          >
            {c}
          </A>
        ))}
      </div>

      <div className="mt-3">

        <button
          onClick={(event) => {
            event.stopPropagation()
            setIsContextSummsDropdownOpen(!isContextSummsDropdownOpen)
          }}
          className={classNames(
            isContextSummsDropdownOpen ? 'rounded-tl-xl rounded-tr-xl' : 'rounded-xl',
            "flex items-center py-4 px-4 bg-[#1d8f89] w-full font-bold"
          )}
        >
          <div>context summaries:</div>
          {isContextSummsDropdownOpen ? (
            <ChevronUpIcon className="w-5 h-5 ml-2" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 ml-2" />
          )}
        </button>

        {isContextSummsDropdownOpen && (
          <div className="py-4 px-2 bg-[#1d8f89]/50 rounded-bl-xl rounded-br-xl">
            <ul className="ml-4 list-disc">
              {Object.values(EMOTE_CONTEXTS_ACTIVE).map((c) => (
                <li key={c} className="mb-2">
                  <span className="font-bold">{c}</span>: {getContextSummary(c)}
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </>
  )
}

export default GoToContext