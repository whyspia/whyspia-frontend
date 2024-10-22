import A from "components/A"
import { GlobalContext } from "lib/GlobalContext"
import Image from "next/image"
import { useContext, useState } from "react"
import { ProfileTooltip } from "./ProfileTooltip"
import { BellIcon } from "@heroicons/react/24/outline"
import {
  ConnectButton,
  useConnect,
  useAccount,
  useConnectors,
  useModal,
} from "@particle-network/connectkit"
import { type Connector } from '@particle-network/connector-core'
import useAuth from "../hooks/useAuth"

export default function AuthStatusWithConnectButton() {
  const { userV2, userNotifData, jwtToken, setIsWhyspiaLoginHappening } = useContext(GlobalContext)

  const [timerId, setTimerId] = useState(null)
  const [profileTooltipVisibility, setProfileTooltipVisibility] =
    useState<Boolean>(false)

  const { connectAsync } = useConnect()
  const { isConnected } = useAccount()
  const connectors = useConnectors()

  const { setInitWhyspiaLoginFlag } = useAuth()

  const handleConnect = ({
    address,
    connectorId,
  }: {
    address?: string;
    connectorId?: string;
  }) => {
    console.log("Connected with address:", address, "via connector:", connectorId)
    // initiateWhyspiaLogin()
  }

  const handleDisconnect = () => {
    console.log("handleDisconnect");
  }

  // const { isOpen, setOpen } = useModal({
  //   onConnect: handleConnect,
  //   onDisconnect: handleDisconnect,
  // })

  // const openParticleModal = () => setOpen(true)
  // const closeParticleModal = () => setOpen(false)

  const handleLogin = async () => {
    if (!isConnected) {
      try {
        const particleEVMConnector: Connector | undefined = connectors.find(connector => connector.id === "particleEVM")
        // console.log('connectors==', connectors)
        await setIsWhyspiaLoginHappening(true)
        await connectAsync({ connector: particleEVMConnector as Connector })
        await setInitWhyspiaLoginFlag(true)
      } catch(err) {
        console.error('particle login failed')
      }
    }
  }

  const onMouseLeaveProfileTooltip = () => {
    setTimerId(
      setTimeout(() => {
        setProfileTooltipVisibility(false)
      }, 200) as any
    )
  }

  const onMouseEnterProfileTooltip = () => {
    timerId && clearTimeout(timerId)
    jwtToken && setProfileTooltipVisibility(true)
  }

  return (
    <>
      {!jwtToken && (
        <>
          <div
            onClick={handleLogin}
            className="relative h-full z-[500] flex justify-center items-center px-4 py-2 ml-2 text-xs font-bold text-white rounded-xl bg-[#1DA1F2] rounded-xl cursor-pointer"
          >
            login
          </div>

          {/* <ConnectButton label="Login" /> */}
        </>
      )}

      {jwtToken && (
        <div className="flex relative z-[700]">

          {/* block dealing with BellIcon/notifications */}
          <A className="relative group cursor-pointer mr-4" href={`/notifications`}>
            <div className="w-10 h-10 rounded-full p-1 group-hover:bg-gray-200 group-hover:bg-opacity-50 flex justify-center items-center">
              <BellIcon className="text-white w-7 h-7" />
            </div>

            {userNotifData && userNotifData?.hasReadCasuallyFalseCount > 0 && (
              <span className="absolute top-2 right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {userNotifData.hasReadCasuallyFalseCount}
              </span>
            )}
          </A>
          
          <div
            onMouseEnter={onMouseEnterProfileTooltip}
            onMouseLeave={onMouseLeaveProfileTooltip}
            className="flex items-center"
          >
            {profileTooltipVisibility && (
              <div className="absolute top-0 mt-10 right-0 mb-1 text-sm text-black rounded-xl shadow bg-white overflow-hidden">
                <ProfileTooltip />
              </div>
            )}

            <A
              href={
                userV2 && userV2?.primaryWallet
                  ? `/u/${
                      userV2 && userV2?.primaryWallet
                        ? userV2?.primaryWallet
                        : ''
                    }`
                  : '#'
              }
            >
              <div className="ml-3 w-8 h-8 relative rounded-full bg-gray-400">
                <Image
                  src={(userV2 as any)?.profilePhoto || '/default-profile-pic.png'}
                  alt="Profile photo"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
            </A>
          
          </div>
        </div>
      )}
    </>
  )
}
