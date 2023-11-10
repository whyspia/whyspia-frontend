import A from "components/A"
import { GlobalContext } from "lib/GlobalContext"
import Image from "next/image"
import { useContext, useState } from "react"
import { twitterLogin } from "../services/UserService"
import { ProfileTooltip } from "./ProfileTooltip"

export default function AuthStatusWithConnectButton() {
  const { user } = useContext(GlobalContext)

  const [timerId, setTimerId] = useState(null)
  const [profileTooltipVisibility, setProfileTooltipVisibility] =
    useState<Boolean>(false)

  const onMouseLeaveProfileTooltip = () => {
    setTimerId(
      setTimeout(() => {
        setProfileTooltipVisibility(false)
      }, 200)
    )
  }

  const onMouseEnterProfileTooltip = () => {
    timerId && clearTimeout(timerId)
    user?.twitterUsername && setProfileTooltipVisibility(true)
  }

  return (
    <>
      {!user?.twitterUsername && (
        <>
          <div
            onClick={() => twitterLogin(null)}
            className="relative h-full z-[500] flex justify-center items-center px-4 py-2 ml-2 text-xs font-bold text-white rounded-xl bg-[#1DA1F2] rounded-xl"
          >
            Connect X
          </div>
        </>
      )}

      {user && user?.twitterUsername && (
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
          <div
            // onClick={openWalletModal}
            className="flex items-center border rounded-3xl px-3 py-2"
          >
            <div className="relative w-6 h-6">
              <Image
                src={'/twitter-solid-blue.svg'}
                alt="twitter-solid-blue-icon"
                layout="fill"
              />
            </div>

            <div className="ml-3 text-gray-400 align-middle whitespace-nowrap hidden md:flex">
              {user?.twitterUsername}
            </div>
          </div>

          <A
            href={
              user && user.twitterUsername
                ? `/u/${
                    user && user.twitterUsername
                      ? user.twitterUsername
                      : ''
                  }`
                : '#'
            }
          >
            <button
              // onClick={active ? null : openWalletModal}
              className="flex items-center space-x-2 h-9 bg-white/[.1] hover:text-blue-500 text-sm font-semibold py-1 ml-2 rounded-lg"
            >
              <div className="ml-3 w-8 h-8 relative rounded-full bg-gray-400">
                <Image
                  src={(user as any)?.profilePhoto || '/default-profile-pic.png'}
                  alt="Profile photo"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
            </button>
          </A>
        </div>
      )}
    </>
  )
}
