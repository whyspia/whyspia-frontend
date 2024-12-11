import { useContext, useState } from "react"
import toast from 'react-hot-toast'
import { isValidWalletAddress } from "../utils/WalletUtils"
import { apiCreateSavedPerson } from "actions/saved-person/apiCreateSavedPerson"
import { GlobalContext } from "lib/GlobalContext"
import { useQueryClient } from "react-query"
import apiGetAllSavedPersons from "actions/saved-person/apiGetAllSavedPersons"

const SavePersonForm = () => {
  const queryClient = useQueryClient()

  const [whyspiaIDInput, setWhyspiaIDInput] = useState('')
  const [isValidWhyspiaID, setIsValidWhyspiaID] = useState(false)
  const [bTypedPersonExists, setbTypedPersonExists] = useState(false)

  const { userV2: loggedInUser, jwtToken } = useContext(GlobalContext)

  const onWhyspiaIDChanged = async (e) => {
    setbTypedPersonExists(false)
    const typedWhyspiaID = e.target.value
    setWhyspiaIDInput(typedWhyspiaID)
    let localIsValid = false

    if (typedWhyspiaID?.length <= 0) {
      setIsValidWhyspiaID(false)
      return
    }

    // check if the input is a valid wallet address
    if (isValidWalletAddress(typedWhyspiaID)) {
      // maybe can share whyspiaIDInput with personInput one day, so dont have to fetch this here
      const savedPersons = await apiGetAllSavedPersons({ jwt: jwtToken, search: whyspiaIDInput, skip: 0, limit: 3, orderBy: 'createdAt', orderDirection: 'desc' })
      const personExists = savedPersons.some(savedPerson =>
        savedPerson.primaryWalletSaved.toLowerCase() === typedWhyspiaID.toLowerCase()
      )

      if (personExists) {
        setbTypedPersonExists(true)
        setIsValidWhyspiaID(false)
        return
      }

      localIsValid = true
    }

    setIsValidWhyspiaID(localIsValid)
  }

  const handleCreateSavedPerson = async () => {
    const chosenName = prompt('enter a name for this person:')
    if (chosenName) {
      const results = await apiCreateSavedPerson({ jwt: jwtToken, primaryWalletSaved: whyspiaIDInput, chosenName })

      if (results) {
        console.log('new person saved successfully')
        toast.success(`new person named "${chosenName}" saved successfully!`)
        // invalidate any key starting with saved-persons-${loggedInUser?.primaryWallet}
        queryClient.invalidateQueries({
          predicate: (query) => 
            query.queryKey[0].toString().startsWith(`saved-persons-${loggedInUser?.primaryWallet}`)
        })

        setWhyspiaIDInput('')
        setIsValidWhyspiaID(false)
      } else {
        console.error('failed to save new person')
        toast.error(`failed to save new person named ${chosenName}`)
      }

      
    }
  }

  return (
    <div>
      <input
        type="search"
        className={`w-full px-4 py-4 text-lg border-4 rounded-lg mb-4 border-[#1d8f89]`}
        placeholder="paste whyspiaID..."
        value={whyspiaIDInput}
        onChange={onWhyspiaIDChanged}
      />

      {isValidWhyspiaID && (
        <div className="bg-[#e5fff3] p-4 rounded-lg border-2 border-[#1d8f89] mb-4">
          <p className="text-black text-sm font-bold">would you like to save a person for this new whyspiaID &quot;{whyspiaIDInput}&quot;?</p>
          
          <div className="flex gap-2 mt-2">
            <button
              className="px-4 py-2 bg-[#1d8f89] text-white rounded-md cursor-pointer hover:opacity-[75%]"
              onClick={handleCreateSavedPerson}
            >
              save person
            </button>
          </div>
        </div>
      )}

      {whyspiaIDInput?.length > 0 && !isValidWhyspiaID && (
        <div className="text-xs text-red-500 my-2">ERROR: invalid whyspiaID</div>
      )}

      {bTypedPersonExists && (
        <div className="text-xs text-red-500 my-2">ERROR: you already saved this whyspiaID...</div>
      )}

      <div className="text-xs my-2">NOTE: go back to search tab to see newly saved people</div>

    </div>
  )
}

export default SavePersonForm 