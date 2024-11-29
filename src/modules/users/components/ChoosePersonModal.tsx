"use client"

import toast from 'react-hot-toast'
import { flatten } from 'lodash'
import { useInfiniteQuery, useQueryClient } from 'react-query'
import apiGetAllSavedPersons from 'actions/saved-person/apiGetAllSavedPersons';
import Modal from 'components/modals/Modal'
import { GlobalContext } from 'lib/GlobalContext';
import { useContext, useState } from 'react';
import { formatWalletAddress, isValidWalletAddress } from '../utils/WalletUtils';
import { apiCreateSavedPerson } from 'actions/saved-person/apiCreateSavedPerson';

const MockContacts = [
  { username: 'vitalik.eth', name: 'Vitalik', lastInteraction: '2 hours ago' },
  { username: 'CryptoKitties', name: 'Kitties Official', lastInteraction: '1 day ago' },
  { username: 'web3_world', name: 'Web3 News', lastInteraction: '3 days ago' },
]

export default function ChoosePersonModal({
  close,
  setNewSelectedPerson,
}: {
  close: () => void
  setNewSelectedPerson: (newSelectedPerson: { calculatedDisplayName: string, chosenName: string, primaryWalletSaved: string }) => void
}) {
  const queryClient = useQueryClient()

  const { userV2: loggedInUser, jwtToken } = useContext(GlobalContext)
  const [selectedPerson, setSelectedPerson] = useState<{ calculatedDisplayName: string, chosenName: string, primaryWalletSaved: string } | null>(null)
  const [personInput, setPersonInput] = useState('')
  const [showCreateSavedPersonPrompt, setShowCreateSavedPersonPrompt] = useState(false)

  const fetchSavedPersons = async ({ pageParam = 0 }) => {
    const savedPersons = await apiGetAllSavedPersons({ jwt: jwtToken, search: personInput, skip: pageParam, limit: 3, orderBy: 'createdAt', orderDirection: 'desc' })
    
    // check if the input is a valid wallet address AND if it exists in the fetched data
    if (isValidWalletAddress(personInput)) {
      const personExists = savedPersons.some(savedPerson =>
        savedPerson.primaryWalletSaved.toLowerCase() === personInput.toLowerCase()
      )
      setShowCreateSavedPersonPrompt(!personExists)
    } else {
      setShowCreateSavedPersonPrompt(false)
    }

    return savedPersons
  }

  const { data: infiniteSavedPersons, fetchNextPage: fetchSavedPersonsNextPage, hasNextPage: hasSavedPersonsNextPage, isFetchingNextPage: isSavedPersonsFetchingNextPage, refetch: refetchSavedPersons } = useInfiniteQuery(
    [`saved-persons-${loggedInUser?.primaryWallet}`, personInput],
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

  const handleSavedPersonClick = (selectedPerson) => {
    setSelectedPerson({
      // only time there should be no primaryWalletSavedUser?.calculatedDisplayName is if there is no user token for that user...
      // currently you can indeed save wallets that have no userToken in our system...soooo yea
      calculatedDisplayName: selectedPerson.primaryWalletSavedUser?.calculatedDisplayName ?? selectedPerson.chosenName,
      chosenName: selectedPerson.chosenName,
      primaryWalletSaved: selectedPerson.primaryWalletSaved
    })
    setShowCreateSavedPersonPrompt(false)
  }

  const handleCreateSavedPerson = async () => {
    const chosenName = prompt('enter a name for this person:')
    if (chosenName) {
      const results = await apiCreateSavedPerson({ jwt: jwtToken, primaryWalletSaved: personInput, chosenName })

      if (results) {
        console.log('new person saved successfully')
        toast.success(`new person named "${chosenName}" saved successfully!`)
        queryClient.invalidateQueries([`saved-persons-${loggedInUser?.primaryWallet}`, personInput])

        setShowCreateSavedPersonPrompt(false)
        const itemOneOfSavedPersonsList = savedPersonsData[0];
        setSelectedPerson(itemOneOfSavedPersonsList)
      } else {
        console.error('failed to save new person')
        toast.error(`failed to save new person named ${chosenName}`)
      }

      
    }
  }

  const handleSkipSaving = () => {
    setShowCreateSavedPersonPrompt(false)
    // NOTE how despite no chosenName there is still a calculatedDisplayName
    setSelectedPerson({ calculatedDisplayName: formatWalletAddress(personInput), chosenName: null, primaryWalletSaved: personInput })
  }

  const handleConfirmSelectedPerson = () => {
    if (selectedPerson) {
      setNewSelectedPerson(selectedPerson)
      // call a function passed from the parent to set the selectedPerson
      close()
    }
  }

  const savedPersonsData = flatten(infiniteSavedPersons?.pages || [])

  // const filteredSavedPersons = savedPersonsData.filter((savedPerson) =>
  //   savedPerson.primaryWalletSaved.toLowerCase().includes(personInput.toLowerCase()) ||
  //   savedPerson.chosenName.toLowerCase().includes(personInput.toLowerCase())
  // )

  return (
    <Modal close={close}>
      <div className="p-6 w-96 md:w-[30rem] text-white">

        <h2 className="text-2xl font-bold mb-4">select person to interact with</h2>

        <input
          type="text"
          className={`w-full px-4 py-4 text-lg border-4 rounded-lg mb-4 ${personInput && !MockContacts.some((contact) =>
            contact.username.toLowerCase() === personInput.toLowerCase()
          ) ? 'border-[#ef4444]' : 'border-[#1d8f89]'}`}
          placeholder="search person OR paste whyspiaID..."
          value={personInput}
          onChange={(e) => {
            setPersonInput(e.target.value)
          }}
        />

        {showCreateSavedPersonPrompt && (
          <div className="bg-[#e5fff3] p-4 rounded-lg border-2 border-[#1d8f89] mb-4">
            <p className="text-black text-sm font-bold">would you like to save a new person for this new whyspiaID "{personInput}"?</p>
            <div className="text-black text-xs">NOTE: this is good idea for people you plan to interact with more than once</div>
            
            <div className="flex gap-2 mt-2">
              <button
                className="px-4 py-2 bg-[#1d8f89] text-white rounded-md cursor-pointer hover:opacity-[75%]"
                onClick={handleCreateSavedPerson}
              >
                save person
              </button>

              <button
                className="px-4 py-2 bg-[#a9a9a9] rounded-md cursor-pointer hover:opacity-[75%]"
                onClick={handleSkipSaving}
              >
                select without saving
              </button>
            </div>
          </div>
        )}

        {selectedPerson && (
          <div className="mb-4">
            {/* <div className="text-xs opacity-[50%] mb-4">selected person</div> */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs opacity-[50%]">selected person</span>
              <button 
                className="text-sm text-red-500 hover:underline" 
                onClick={() => setSelectedPerson(null)}
              >
                clear
              </button>
            </div>

            <div className="p-3 rounded-lg border-4 bg-[#3a3a3a] border-[#1d8f89]">
              <strong>{selectedPerson?.calculatedDisplayName ?? selectedPerson.chosenName}</strong>
              <div>{selectedPerson.primaryWalletSaved}</div>
              {/* <small>last interaction: meep</small> */}
            </div>
          </div>
        )}

        <div className="mb-4">
          <div className="text-xs opacity-[50%] mb-4">saved people</div>

          <div className="">

            {savedPersonsData.map((savedPerson) => (
              <div
                key={savedPerson.savedBy + savedPerson.primaryWalletSaved}
                className="p-3 rounded-lg mb-2 cursor-pointer hover:bg-[#3a3a3a] hover:border-[#1d8f89] border-4 "
                onClick={() => handleSavedPersonClick(savedPerson)}
              >
                <strong>{savedPerson.primaryWalletSavedUser?.calculatedDisplayName ?? savedPerson.chosenName}</strong>
                <div>{savedPerson.primaryWalletSaved}</div>
                {/* <small>last interaction: meep</small> */}
              </div>
            ))}

            {hasSavedPersonsNextPage && <button onClick={() => fetchSavedPersonsNextPage()} disabled={!hasSavedPersonsNextPage || isSavedPersonsFetchingNextPage}>
              {isSavedPersonsFetchingNextPage ? 'Loading...' : 'Load More'}
            </button>}
          </div>
        </div>

        {selectedPerson && (
          <button
            onClick={handleConfirmSelectedPerson}
            className="mt-4 px-4 py-2 bg-[#1d8f89] text-white rounded-md"
          >
            confirm selected person
          </button>
        )}

      </div>
    </Modal>
  )
}
