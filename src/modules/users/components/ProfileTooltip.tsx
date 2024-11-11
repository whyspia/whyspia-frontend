import A from 'components/A'
import useAuth from '../hooks/useAuth'
import Image from 'next/image'
import { useContext } from 'react'
import { GlobalContext } from 'lib/GlobalContext'
import { useAccount, } from "@particle-network/connectkit"
import ModalService from 'components/modals/ModalService'
import UserSettingsModal from './UserSettingsModal'
import { CogIcon } from '@heroicons/react/24/solid'
import { isDefaultDisplayNameFormat } from '../utils/WalletUtils'

export const ProfileTooltip = () => {
  const { userV2 } = useContext(GlobalContext)
  const { whyspiaLogout, handleParticleDisconnect } = useAuth()
  const { isConnected, } = useAccount()

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

  const handleDisconnect = async () => {
    if (isConnected) {
      await handleParticleDisconnect()
      whyspiaLogout()
    }
  }

  const isDefaultDisplayNameUsed = userV2?.displayName && isDefaultDisplayNameFormat(userV2?.displayName)

  return (
    <div className="flex flex-col w-64 text-black">

      <A href={`/u/${userV2?.primaryWallet}`}>
        <div className="cursor-pointer flex items-center py-3 px-4 border-t border-gray-100 hover:bg-gray-300">
          <div className="relative w-6 h-6">
            <Image
              src={'/x-logo-black.svg'}
              alt="x-logo-black-icon"
              layout="fill"
            />
          </div>
          <span className="ml-2 font-medium">{userV2?.displayName}</span>
        </div>
      </A>

      {isDefaultDisplayNameUsed && (
        <div
          className="cursor-pointer flex items-center py-3 px-4 border-t border-gray-100 bg-red-500 hover:bg-red-600 font-bold"
          onClick={() => ModalService.open(UserSettingsModal)}
        >
          <span className="ml-2 font-medium">CHANGE DISPLAY NAME</span>
        </div>
      )}

      <div
        className="cursor-pointer flex items-center py-3 px-4 border-t border-gray-100 hover:bg-gray-300"
        onClick={() => ModalService.open(UserSettingsModal)}
      >
        <CogIcon className="w-6 h-6 text-gray-400" />
        <span className="ml-2 font-medium">settings</span>
      </div>

      <div
        className="cursor-pointer flex items-center py-3 px-4 border-t border-gray-100 hover:bg-gray-300"
        onClick={handleDisconnect}
      >
        <span className="ml-2 font-medium">logout</span>
      </div>
    </div>
  )
}
