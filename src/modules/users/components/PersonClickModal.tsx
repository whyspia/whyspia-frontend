"use client"

import { LinkIcon } from '@heroicons/react/24/outline'
import Modal from 'components/modals/Modal'
import classNames from 'classnames'
import A from 'components/A'
import { UserV2PublicProfile } from '../types/UserNameTypes'
import toast from 'react-hot-toast'
import copy from 'copy-to-clipboard'
import { formatWalletAddress } from '../utils/WalletUtils'


export default function PersonClickModal({
  close,
  userToken,
}: {
  close: () => void
  userToken: UserV2PublicProfile
}) {

  const onOptionSelected = (option: string) => {
    close()
  }

  const handleCopyWalletID = () => {
    copy(userToken.primaryWallet) // Copy the wallet ID to clipboard
    toast.success('whyspia ID copied to clipboard') // Show success toast
  }

  const primaryWallet = userToken?.primaryWallet
  const chosenPublicName = userToken?.chosenPublicName
  const calculatedDisplayName = userToken?.calculatedDisplayName

  return (
    <Modal close={close}>
      <div className="p-6 w-96 md:w-[30rem] text-white">

        {/* really only time there is no calculatedDisplayName iz if privateUserToken */}
        <div className="text-2xl font-bold mb-4">{calculatedDisplayName ?? chosenPublicName}</div>
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
        </div>


      </div>
    </Modal>
  )
}
