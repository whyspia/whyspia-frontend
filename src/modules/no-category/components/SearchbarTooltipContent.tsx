import A from "components/A"
import { UserV2PublicProfile } from "modules/users/types/UserNameTypes"


export const SearchbarTooltipContent = ({
  userTokens,
  searchText,
}: {
  userTokens: UserV2PublicProfile[]
  searchText: string
}) => {

  return (
    <div className="flex flex-col w-full text-black">

      {searchText && searchText?.length > 0 && (
        <A
          href={`/symbol/${searchText?.toLowerCase()}`}
          className="cursor-pointer flex items-center py-3 px-4 border-b border-gray-300 hover:bg-gray-300"
        >
          <span className="ml-2 font-medium">SYMBOL: {searchText}</span>
        </A>
      )}

      {userTokens && userTokens?.length > 0 && userTokens.map((userToken) => {
        return (
          <A
            key={userToken.primaryWallet}
            href={`/u/${userToken.primaryWallet}`}
            className="cursor-pointer py-3 px-4 border-b border-gray-300 hover:bg-gray-300"
          >
            <div className="relative text-white p-3 rounded-lg border-4 bg-[#3a3a3a] border-[#1d8f89]">
              <strong>{userToken?.calculatedDisplayName ?? userToken.chosenPublicName}</strong>
              <div>{userToken.primaryWallet}</div>
              {/* <small>last interaction: meep</small> */}

              {userToken?.isRequestedUserSavedByRequestingUser && (
                <div className="text-red-500 absolute top-0 right-0 bg-[#1d8f89]/[0.5] border-b-2 border-l-2 border-[#1d8f89] rounded-bl-lg text-white p-1 text-xs">
                  you saved this person
                </div>
              )}
            </div>
          </A>
        )
      })}

      {searchText && searchText?.length > 0 && (
        <A
          href={`/search?searchQuery=${searchText}`} 
          className="cursor-pointer flex items-center py-3 px-4 border-b border-gray-300 hover:bg-gray-300"
        >
          <span className="ml-2 font-medium">full search page</span>
        </A>
      )}
      
    </div>
  )
}
