"use client"

import { flatten } from 'lodash'
import { useInfiniteQuery } from 'react-query'
import apiGetAllSavedPersons from 'actions/saved-person/apiGetAllSavedPersons'
import { GlobalContext } from 'lib/GlobalContext'
import { useContext, useState } from 'react'
import classNames from 'classnames';
import ModalService from 'components/modals/ModalService'
import SavePersonForm from './SavePersonForm'
import PersonClickModal from './PersonClickModal'
import { convertSavedPersonToUserProfile } from '../utils/UserUtils'

const SavedPeopleUI = () => {
  const { userV2: loggedInUser, jwtToken } = useContext(GlobalContext)
  const [personInput, setPersonInput] = useState('')

  const [selectedTab, setSelectedTab] = useState('search')

  const fetchSavedPersons = async ({ pageParam = 0 }) => {
    const savedPersons = await apiGetAllSavedPersons({ jwt: jwtToken, search: personInput, skip: pageParam, limit: 3, orderBy: 'createdAt', orderDirection: 'desc' })

    return savedPersons
  }

  const { data: infiniteSavedPersons, fetchNextPage: fetchSavedPersonsNextPage, hasNextPage: hasSavedPersonsNextPage, isFetchingNextPage: isSavedPersonsFetchingNextPage, refetch: refetchSavedPersons } = useInfiniteQuery(
    [`saved-persons-${loggedInUser?.primaryWallet}`, personInput?.toLowerCase()],
    ({ pageParam = 0 }) =>
      fetchSavedPersons({
        pageParam
      }),
    {
      getNextPageParam: (lastGroup, allGroups) => {
        const morePagesExist = lastGroup?.length === 3

        if (!morePagesExist) {
          return false
        }

        return allGroups.length * 3
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: Boolean(jwtToken),
      keepPreviousData: true,
    }
  )

  const savedPersonsData = flatten(infiniteSavedPersons?.pages || [])

  return (
    <div className="w-full text-white">

      <h2 className="text-2xl font-bold mb-4">saved people of {loggedInUser?.chosenPublicName}</h2>

      <div className="flex gap-4 mb-4">
        <button
          // className="px-4 py-2 bg-[#1d8f89] text-white rounded-md"
          className={classNames(
            'relative px-3 py-2 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer',
            selectedTab === 'search' ? 'bg-[#1d8f89] selected-tab-triangle' : '',
          )}
          onClick={() => setSelectedTab('search')}
        >
          search
        </button>
        <button
          // className="px-4 py-2 bg-[#1d8f89] text-white rounded-md"
          className={classNames(
            'relative px-3 py-2 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer',
            selectedTab === 'save' ? 'bg-[#1d8f89] selected-tab-triangle' : '',
          )}
          onClick={() => setSelectedTab('save')}
        >
          save person
        </button>
      </div>

      {selectedTab === 'search' && (
        <div>
          <input
            type="search"
            className={`w-full px-4 py-4 text-lg border-4 rounded-lg mb-4 border-[#1d8f89]`}
            placeholder="search person..."
            value={personInput}
            onChange={(e) => {
              setPersonInput(e.target.value)
            }}
          />

          <div className="mb-4">
            <div className="text-xs opacity-[50%] mb-4">saved people</div>

            <div className="">

              {savedPersonsData.map((savedPerson) => (
                <div
                  key={savedPerson.savedBy + savedPerson.primaryWalletSaved}
                  className="p-3 rounded-lg mb-2 cursor-pointer hover:bg-[#3a3a3a] hover:border-[#1d8f89] border-4 "
                  onClick={(event) => {
                    event.stopPropagation()
                    ModalService.open(PersonClickModal, { userToken: convertSavedPersonToUserProfile(savedPerson) })
                    // ModalService.open(ConfirmDialogModal, {
                    //   message: `are you sure you want to open profile of "${savedPerson.primaryWalletSavedUser?.calculatedDisplayName ?? savedPerson.chosenName}" in new tab?`,
                    //   onConfirm: () => window.open(`/u/${savedPerson.primaryWalletSaved}`),
                    // })
                  }}
                >
                  <strong>{savedPerson.primaryWalletSavedUser?.calculatedDisplayName ?? savedPerson.chosenName}</strong>
                  <div>{savedPerson.primaryWalletSaved}</div>
                  {/* <small>last interaction: meep</small> */}
                </div>
              ))}

              {hasSavedPersonsNextPage && (
                <button 
                  onClick={() => fetchSavedPersonsNextPage()} 
                  disabled={!hasSavedPersonsNextPage || isSavedPersonsFetchingNextPage}
                  className="mt-2 px-2 py-1 bg-[#1d8f89] text-white rounded-md hover:opacity-[75%]"
                >
                  {isSavedPersonsFetchingNextPage ? 'loading...' : 'load more'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'save' && (
        <SavePersonForm />
      )}

      

    </div>
  )
}

export default SavedPeopleUI
