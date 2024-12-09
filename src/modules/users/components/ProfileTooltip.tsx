import A from 'components/A'
import useAuth from '../hooks/useAuth'
import { LinkIcon, UserIcon, ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import toast from 'react-hot-toast'
import copy from 'copy-to-clipboard'
import { useContext } from 'react'
import { GlobalContext } from 'lib/GlobalContext'
import ModalService from 'components/modals/ModalService'
import UserSettingsModal from './UserSettingsModal'
import { CogIcon } from '@heroicons/react/24/solid'
import { formatWalletAddress, isDefaultChosenPublicNameFormat } from '../utils/WalletUtils'
import SavedPeopleModal from './SavedPeopleModal'

export const ProfileTooltip = () => {
  const { userV2 } = useContext(GlobalContext)
  const { handleParticleAndWhyspiaDisconnect } = useAuth()

  // const onClickSettings = async () => {
  //   // if jwtToken is not present, then popup modal and MM popup to ask user to create account or sign in
  //   if (!jwtToken) {
  //     ModalService.open(CreateAccountModal, {})
  //     const isLoginSuccess = await onLoginClicked()
  //     ModalService.closeAll() // Get weird errors without this due to modal being closed inside CreateAccountModal in useEffect
  //     if (isLoginSuccess) {
  //       ModalService.open(ProfileSettingsModal)
  //     }

  //     return
  //   }

  //   ModalService.open(ProfileSettingsModal)
  // }

  const handleCopyWalletID = () => {
    if (userV2?.primaryWallet) {
      copy(userV2.primaryWallet) // Copy the wallet ID to clipboard
      toast.success('whyspia ID copied to clipboard') // Show success toast
    }
  }

  const isDefaultChosenPublicNameUsed = userV2?.chosenPublicName && isDefaultChosenPublicNameFormat(userV2?.chosenPublicName)

  return (
    <div className="flex flex-col w-64 text-black">

      <A href={`/u/${userV2?.primaryWallet}`}>
        <div className="cursor-pointer flex items-center py-3 px-4 border-t border-gray-100 hover:bg-gray-300">
          <div className="relative w-6 h-6">
            <Image
              src={(userV2 as any)?.profilePhoto || '/default-profile-pic.png'}
              alt="Profile photo"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          </div>

          <div className="ml-2">
            <div className="font-medium">{userV2?.chosenPublicName}</div>
            {!isDefaultChosenPublicNameUsed && userV2?.primaryWallet && (
              <div className="text-xs text-gray-500">{formatWalletAddress(userV2.primaryWallet)}</div>
            )}
          </div>
        </div>
      </A>

      <div
        className="cursor-pointer flex items-center py-3 px-4 border-t border-gray-100 hover:bg-gray-300"
        onClick={handleCopyWalletID}
      >
        <LinkIcon className={'w-5 h-5'} />
        <span className="ml-2 font-medium">COPY WHYSPIA ID</span>
      </div>

      {isDefaultChosenPublicNameUsed && (
        <div
          className="cursor-pointer flex items-center py-3 px-4 border-t border-gray-100 bg-red-500 hover:bg-red-600 font-bold"
          onClick={() => ModalService.open(UserSettingsModal)}
        >
          <span className="ml-2 font-medium">CHANGE DISPLAY NAME</span>
        </div>
      )}

      <div
        className="cursor-pointer flex items-center py-3 px-4 border-t border-gray-100 hover:bg-gray-300"
        onClick={() => ModalService.open(SavedPeopleModal)}
      >
        <UserIcon className={'w-5 h-5'} />
        <div className="ml-2">
          <div className="font-medium">your saved people list</div>
          <div className="text-xs">save new people here</div>
        </div>
      </div>

      <div
        className="cursor-pointer flex items-center py-3 px-4 border-t border-gray-100 hover:bg-gray-300"
        onClick={() => ModalService.open(UserSettingsModal)}
      >
        <CogIcon className="w-6 h-6 text-gray-400" />
        <span className="ml-2 font-medium">settings</span>
      </div>

      <div
        className="cursor-pointer flex items-center py-3 px-4 border-t border-gray-100 hover:bg-gray-300"
        onClick={handleParticleAndWhyspiaDisconnect}
      >
        <ArrowLeftEndOnRectangleIcon className={'w-5 h-5'} />
        <span className="ml-2 font-medium">logout</span>
      </div>
    </div>
  )
}
