import A from "components/A"
import { GlobalContext } from "lib/GlobalContext"
import Image from "next/image"
import { useContext, useState } from "react"
import { twitterLogin } from "../services/UserService"
import { ProfileTooltip } from "./ProfileTooltip"
import { BellIcon } from "@heroicons/react/outline"

export default function AuthStatusWithConnectButton() {
  const { user, userNotifData } = useContext(GlobalContext)

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
                user && user.twitterUsername
                  ? `/u/${
                      user && user.twitterUsername
                        ? user.twitterUsername
                        : ''
                    }`
                  : '#'
              }
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
            </A>
          
          </div>
        </div>
      )}
    </>
  )
}
