"use client"

import { LinkIcon } from '@heroicons/react/24/outline'
import Modal from 'components/modals/Modal'
import classNames from 'classnames'
import A from 'components/A'
import { UserV2PublicProfile } from '../types/UserNameTypes'
import toast from 'react-hot-toast'
import copy from 'copy-to-clipboard'
import { formatWalletAddress } from '../utils/WalletUtils'
import { apiUpdateSavedPerson } from 'actions/saved-person/apiUpdateSavedPerson'
import { useContext, useState } from 'react'
import { useQueryClient } from "react-query"
import { GlobalContext } from 'lib/GlobalContext'


export default function PersonClickModal({
  close,
  userToken,
}: {
  close: () => void
  userToken: UserV2PublicProfile
}) {
  const queryClient = useQueryClient()
  const { userV2: loggedInUser, jwtToken } = useContext(GlobalContext)

  const [displayedName, setDisplayedName] = useState(userToken.calculatedDisplayName ?? userToken.chosenPublicName)

  const onOptionSelected = (option: string) => {
    close()
  }

  const handleCopyWalletID = () => {
    copy(userToken.primaryWallet) // Copy the wallet ID to clipboard
    toast.success('whyspiaID copied to clipboard')
  }

  const handleEditSavedName = async () => {
    const newChosenName = prompt('enter a new name for this person:')
    if (newChosenName) {
      const result = await apiUpdateSavedPerson({
        jwt: jwtToken,
        savedPersonID: userToken.id,
        updatedChosenName: newChosenName,
      })

      if (result) {
        setDisplayedName(newChosenName)
        toast.success(`new name "${newChosenName}" saved successfully!`)
        // invalidate any key starting with saved-persons-${loggedInUser?.primaryWallet}
        queryClient.invalidateQueries({
          predicate: (query) => 
            query.queryKey[0].toString().startsWith(`saved-persons-${loggedInUser?.primaryWallet}`)
        })

      } else {
        console.error('failed to save new name')
        toast.error(`failed to save new name ${newChosenName}`)
      }
    }
  }

  const primaryWallet = userToken?.primaryWallet

  return (
    <Modal close={close}>
      <div className="relative p-6 w-96 md:w-[30rem] text-white">

        {userToken?.isRequestedUserSavedByRequestingUser && (
          <div className="absolute top-0 right-0 bg-[#1d8f89]/[0.5] border-b-2 border-l-2 border-[#1d8f89] rounded-bl-lg text-white p-2 text-xs">
            you saved this person
          </div>
        )}

        {/* really only time there is no calculatedDisplayName iz if privateUserToken */}
        <div className="text-2xl font-bold mb-4">{displayedName}</div>
        <div
          onClick={handleCopyWalletID}
          className="text-xs text-gray-500 mb-4 flex items-center cursor-pointer"
        >
          <LinkIcon
            className={'w-4 h-4'}
          />
          <span className="ml-1">{formatWalletAddress(primaryWallet)}</span>
        </div>

        <div className="flex flex-wrap justify-center mt-6">
          {/* <A
            onClick={() => onOptionSelected('symbol')}
            href={`/symbol/${symbol}`}
            className={classNames(
              'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer'
            )}
          >
            view symbol
          </A> */}

          <A
            onClick={() => onOptionSelected('user')}
            href={`/u/${primaryWallet}`}
            className={classNames(
              'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer'
            )}
          >
            go to user profile
          </A>

          {userToken?.isRequestedUserSavedByRequestingUser && (
            <button
              onClick={handleEditSavedName}
              className="p-3 mb-4 mr-2 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer"
            >
              edit saved name
            </button>
          )}
        </div>


      </div>
    </Modal>
  )
}
