import A from 'components/A'
import useAuth from '../hooks/useAuth'
import Image from 'next/image'
import { useContext } from 'react'
import { GlobalContext } from 'lib/GlobalContext'

export const ProfileTooltip = () => {
  const { user } = useContext(GlobalContext)
  const { twitterLogout } = useAuth()

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

  const onClickDisconnectTwitter = async () => {
    twitterLogout()
  }

  return (
    <div className="flex flex-col w-64 text-black">

      <A href={`/u/${user?.twitterUsername}`}>
        <div className="cursor-pointer flex items-center py-3 px-4 border-t border-gray-100 hover:bg-gray-300">
          <div className="relative w-6 h-6">
            <Image
              src={'/twitter-solid-blue.svg'}
              alt="twitter-solid-blue-icon"
              layout="fill"
            />
          </div>
          <span className="ml-2 font-medium">My Profile</span>
        </div>
      </A>

      {/* {active && (
        <div
          className="cursor-pointer flex items-center py-3 px-4 border-t border-gray-100 hover:bg-brand-gray"
          onClick={onClickSettings}
        >
          <BiCog className="w-6 h-6  text-gray-400" />
          <span className="ml-2 font-medium">Edit Profile</span>
        </div>
      )} */}

      <div
        className="cursor-pointer flex items-center py-3 px-4 border-t border-gray-100 hover:bg-gray-300"
        onClick={onClickDisconnectTwitter}
      >
        <span className="ml-2 font-medium">Disconnect Twitter</span>
      </div>
    </div>
  )
}
