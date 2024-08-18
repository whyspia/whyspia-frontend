import { apiCreateSymbolDefinition } from "actions/symbol-definitions/apiCreateSymbolDefinition"
import classNames from "classnames"
import { useState } from "react"
import toast from 'react-hot-toast'
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline"
import { useInfiniteQuery } from "react-query"
import apiGetAllDefinitions from "actions/symbol-definitions/apiGetAllDefinitions"
import { flatten } from "lodash"
import CircleSpinner from "components/animations/CircleSpinner"
import A from "components/A"
import { formatTimeAgo } from "utils/randomUtils"
import { twitterLogin } from "modules/users/services/UserService"

const DefineUI2 = ({ jwtToken, user, symbolData, symbolText }) => {
  const [definition, setDefinition] = useState('')
  const [currentDefinition, setCurrentDefinition] = useState(symbolData?.currentDefinition)
  const [isValid, setIsValid] = useState(false)
  const [isDefinitionSubmitting, setIsDefinitionSubmitting] = useState(false)
  const [isPreviousDefinitionVisible, setIsPreviousDefinitionVisible] = useState(true)

  const fetchDefinitions = async ({ pageParam = 0 }) => {
    const defintions = await apiGetAllDefinitions({ symbol: symbolText ? symbolText : null, skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' })
    return defintions
  }

  const { data: infiniteDefinitions, fetchNextPage: fetchDefinitionsNextPage, hasNextPage: hasDefinitionsNextPage, isFetchingNextPage: isDefinitionsFetchingNextPage } = useInfiniteQuery(
    ['definitions', 10, isDefinitionSubmitting, symbolData, symbolText],
    ({ pageParam = 0 }) =>
    fetchDefinitions({
        pageParam
      }),
    {
      getNextPageParam: (lastGroup, allGroups) => {
        const morePagesExist = lastGroup?.length === 10

        if (!morePagesExist) {
          return false
        }

        return allGroups.length * 10
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: true,
      keepPreviousData: true,
    }
  )

  const onDefinitionTyped = (definition: string) => {
    setDefinition(definition)
    setIsValid(definition !== '')
  }

  const onSubmitDefinition = async () => {
    setIsDefinitionSubmitting(true)

    const definitionResult = await apiCreateSymbolDefinition({
      jwt: jwtToken,
      symbol: symbolText ? symbolText : null,
      symbolDefinition: definition,
    })
  
    if (definitionResult) {
      console.log('definition submitted successfully:', definitionResult)
      setCurrentDefinition(definitionResult?.currentDefinition)
    } else {
      console.error('Failed to define symbol')
    }

    setIsDefinitionSubmitting(false)

    toast.success(`"${symbolText ? symbolText : ""}" has been defined!`)
  }

  const definitionsData = flatten(infiniteDefinitions?.pages || [])

  return (
    <div className="flex flex-col items-center">

      {!user?.twitterUsername ? (
        <>
          <div
            onClick={() => twitterLogin(null)}
            className="relative h-20 flex justify-center items-center px-4 py-2 ml-2 mb-8 text-xs font-bold text-white rounded-xl bg-[#1DA1F2] rounded-xl cursor-pointer"
          >
            connect X
          </div>
        </>
      ) : (
        <>
          <div className="mt-4 flex flex-col items-center">

            <div onClick={() => setIsPreviousDefinitionVisible(!isPreviousDefinitionVisible)} className="mb-1 flex items-center">
              <div className="mr-1 font-bold text-lg cursor-pointer">current definition</div>
              
              <div className="cursor-pointer">
                {isPreviousDefinitionVisible ? (
                  <ChevronUpIcon className="w-5" />
                ) : (
                  <ChevronDownIcon className="w-5" />
                )}
              </div>
            </div>

            {isPreviousDefinitionVisible && (
              <>
                {currentDefinition ? (
                  <div className="whitespace-pre-wrap break-words leading-5">{currentDefinition}</div>
                ) : (
                  "You have not defined this symbol yet...loser"
                )}
              </>
            )}

          </div>

          <textarea
            value={definition}
            onChange={(event) => onDefinitionTyped(event.target.value)}
            placeholder="enter new definition..."
            className="w-full block p-2 text-lg border-yellow-500 border-4 shadow-lg rounded-lg my-4"
          />

          <button
            onClick={onSubmitDefinition}
            className={classNames(
              `text-white p-4 text-xl shadow-lg rounded-lg mb-8 border border-[#1d8f89] hover:border-white`,
              isValid ? `bg-[#1d8f89] cursor-pointer` : `bg-[#1d8f89]/50`,
            )}
            disabled={!isValid}
          >
            send
          </button>

          {isDefinitionSubmitting && <CircleSpinner color="white" bgcolor="#0857e0" />}
        </>
      )}

      

      {definitionsData?.map((definition) => (
        <div className="text-lg" key={definition.id}>
          <A href={`/u/${definition.senderTwitterUsername}`} className="text-blue-500 hover:text-blue-700 cursor-pointer">{definition.senderTwitterUsername}</A> defined &quot;<A href={`/symbol/${definition.symbol}`} className="text-red-500 hover:text-red-700 cursor-pointer">{definition.symbol}</A>&quot; - {formatTimeAgo(definition.timestamp)}
        </div>
      ))}

      {hasDefinitionsNextPage && <button onClick={() => fetchDefinitionsNextPage()} disabled={!hasDefinitionsNextPage || isDefinitionsFetchingNextPage}>
        {isDefinitionsFetchingNextPage ? 'Loading...' : 'Load More'}
      </button>}

    </div>
  )
}

export default DefineUI2
