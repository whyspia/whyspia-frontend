"use client"

import type { NextPage } from 'next'
import { flatten } from 'lodash'
import { useContext, useEffect, useState } from 'react'
import A from 'components/A'
import { getAllUserTokens } from 'actions/users/apiUserActions'
import { useInfiniteQuery } from 'react-query'
import classNames from 'classnames'
import { useSearchParams } from 'next/navigation'
import { GlobalContext } from 'lib/GlobalContext'

const SearchPage: NextPage = () => {
  const searchParams = useSearchParams()
  const searchParam = searchParams.get('searchQuery')
  const [searchBarQuery, setSearchBarQuery] = useState('')

  const { jwtToken, isJwtLoadingFinished } = useContext(GlobalContext)

  const fetchUserTokens = async ({ pageParam = 0 }) => {
    const userTokens = await getAllUserTokens({ search: searchBarQuery, skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc', jwt: jwtToken })
    return userTokens
  }

  const { data: infiniteUserTokens, fetchNextPage: fetchSearchNextPage, hasNextPage: hasSearchNextPage, isFetchingNextPage: isSearchFetchingNextPage } = useInfiniteQuery(
    ['search', searchBarQuery],
    ({ pageParam = 0 }) =>
      fetchUserTokens({
        pageParam
      }),
    {
      enabled: (Boolean(searchBarQuery && searchBarQuery?.length > 0) && isJwtLoadingFinished), // disables query if this is not true
      getNextPageParam: (lastGroup, allGroups) => {
        const morePagesExist = lastGroup?.length === 10

        if (!morePagesExist) {
          return false
        }

        return allGroups.length * 10
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  )

  useEffect(() => {
    if (searchParam) {
      setSearchBarQuery(searchParam)
    }
  }, [searchParam])

  const onSearchBarTyped = (symbol: string) => {
    setSearchBarQuery(symbol)
  }

  const userTokens = flatten(infiniteUserTokens?.pages || [])

  return (
    <div className="text-center px-4 relative z-40">

      <div className="text-2xl font-bold">search symbols or users</div>

      <div className="md:w-[70rem] w-full flex flex-col flex-wrap justify-center items-center mt-6 mx-auto">

        <input
          type="text"
          value={searchBarQuery}
          onChange={(e) => onSearchBarTyped(e.target.value)}
          placeholder="Search"
          className="block md:w-[30rem] w-full border border-gray-300 rounded px-3 py-2 mb-8"
        />

        {searchBarQuery && searchBarQuery?.length > 0 && (
          <A
            href={`/symbol/${searchBarQuery?.toLowerCase()}`}
            className="w-full flex justify-center cursor-pointer flex items-center py-3 px-4 border-b border-gray-300 hover:bg-gray-300"
          >
            <span className="ml-2 font-medium">SYMBOL: {searchBarQuery}</span>
          </A>
        )}

        {userTokens && userTokens?.length > 0 && userTokens.map((userToken) => {
          return (
            <A
              key={userToken.primaryWallet}
              href={`/u/${userToken.primaryWallet}`}
              className="w-full cursor-pointer py-3 px-4 border-b border-gray-300 hover:bg-gray-300"
            >
              <div className="relative text-white p-3 rounded-lg border-4 bg-[#3a3a3a] border-[#1d8f89]">
                <strong>{userToken?.calculatedDisplayName ?? userToken.chosenPublicName}</strong>
                <div>{userToken.primaryWallet}</div>
                {/* <small>last interaction: meep</small> */}

                {userToken?.isRequestedUserSavedByRequestingUser && (
                  <div className="text-red-500 absolute top-0 right-0 bg-[#1d8f89]/[0.5] border-b-2 border-l-2 border-[#1d8f89] rounded-bl-lg text-white p-2 text-xs">
                    you saved this person
                  </div>
                )}
              </div>
            </A>
          )
        })}

        {/* Show more button */}
        {hasSearchNextPage && (
          <button
            onClick={(event) => {
              event.stopPropagation()
              fetchSearchNextPage()
            }}
            disabled={isSearchFetchingNextPage}
            className={classNames(
              'flex items-center justify-center w-full py-2 mt-2 text-sm font-semibold text-white bg-[#1d8f89] rounded-md',
              {
                'opacity-50 cursor-not-allowed': isSearchFetchingNextPage,
              }
            )}
          >
            {isSearchFetchingNextPage ? 'Loading...' : 'Show more'}
          </button>
        )}

      </div>

    </div>
  )
}

export default SearchPage
