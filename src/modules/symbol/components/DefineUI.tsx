import { apiCreateSymbolDefinition } from "actions/symbol-definitions/apiCreateSymbolDefinition"
import apiGetUserDefinition from "actions/symbol-definitions/apiGetUserDefinition"
import classNames from "classnames"
import debounce from 'lodash/debounce'
import { useState } from "react"
import toast from 'react-hot-toast'
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"

const DefineUI = ({ jwtToken }) => {
  const [definition, setDefinition] = useState('')
  const [previousDefinition, setPreviousDefinition] = useState(null)
  const [selectedSymbol, setSelectedSymbol] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [isDefinitionSubmitting, setIsDefinitionSubmitting] = useState(false)
  const [isPreviousDefinitionVisible, setIsPreviousDefinitionVisible] = useState(true)

  const onSymbolTyped = (symbol: string) => {
    getPreviousDefinition(symbol)

    setSelectedSymbol(symbol)
    setIsValid(definition !== '' && symbol !== '')
  }
  
  const getPreviousDefinition = debounce(async (symbol: string) => {
    const prev = await apiGetUserDefinition({ jwt: jwtToken, symbol })
    setPreviousDefinition(prev)
    setIsPreviousDefinitionVisible(true)
  }, 1000)

  const onDefinitionTyped = (definition: string) => {
    setDefinition(definition)
    setIsValid(selectedSymbol !== '' && definition !== '')
  }

  const onSubmitDefinition = async () => {
    setIsDefinitionSubmitting(true)

    const definitionResult = await apiCreateSymbolDefinition({
      jwt: jwtToken,
      symbol: selectedSymbol,
      symbolDefinition: definition,
    })
  
    if (definitionResult) {
      console.log('definition submitted successfully:', definitionResult)
      setPreviousDefinition(definitionResult)
    } else {
      console.error('Failed to define symbol')
    }

    setIsDefinitionSubmitting(false)

    toast.success(`"${selectedSymbol}" has been defined!`)
  }

  return (
    <div>
            
      <div className="font-bold text-lg mb-1">symbol to define:</div>

      <textarea
        value={selectedSymbol}
        onChange={(event) => onSymbolTyped(event.target.value)}
        placeholder="enter symbol..."
        className="w-full rounded-lg px-2 py-1"
      />

      {previousDefinition && (
        <div className="my-2">
          <div className="mb-1 flex items-center">
            <div className="mr-1 font-bold text-lg cursor-pointer">current definition</div>
            
            <div onClick={() => setIsPreviousDefinitionVisible(!isPreviousDefinitionVisible)} className="cursor-pointer">
              {isPreviousDefinitionVisible ? (
                <ChevronUpIcon className="w-5" />
              ) : (
                <ChevronDownIcon className="w-5" />
              )}
            </div>
          </div>

          {isPreviousDefinitionVisible && (
            <div className="whitespace-pre-wrap break-words leading-5">{previousDefinition?.currentDefinition}</div>
          )}
          
        </div>
      )}

      <div className="font-bold text-lg mb-1">definition of symbol:</div>

      <textarea
        value={definition}
        onChange={(event) => onDefinitionTyped(event.target.value)}
        placeholder="enter definition..."
        className="w-full rounded-lg px-2 py-1"
      />

      {/* submit button */}
      <button
        onClick={onSubmitDefinition}
        className={classNames(
          'block rounded-lg text-white px-4 py-2 mt-4 font-bold',
          {
            'bg-gray-400': !isValid,
            'bg-[#1d8f89] border border-[#1d8f89] hover:border-white cursor-pointer': isValid,
          }
        )}
        disabled={!isValid}
      >
        submit
      </button>

    </div>
  )
}

export default DefineUI
