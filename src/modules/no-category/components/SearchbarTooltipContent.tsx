import A from "components/A"


export const SearchbarTooltipContent = ({
  userTokens,
  searchText,
}: {
  userTokens: any
  searchText: string
}) => {

  return (
    <div className="flex flex-col w-full text-black">

      {searchText && searchText?.length > 0 && (
        <A
          href={`/symbol/${searchText?.toLowerCase()}`}
          className="cursor-pointer flex items-center py-3 px-4 border-b border-gray-300 hover:bg-gray-300"
          //onClick={onClickDisconnectTwitter}
        >
          <span className="ml-2 font-medium">SYMBOL: {searchText}</span>
        </A>
      )}

      {userTokens && userTokens?.length > 0 && userTokens.map((userToken) => {
        return (
          <A
            key={userToken.id}
            href={`/u/${userToken.twitterUsername}`}
            className="cursor-pointer flex items-center py-3 px-4 border-b border-gray-300 hover:bg-gray-300"
            //onClick={onClickDisconnectTwitter}
          >
            <span className="ml-2 font-medium">USER: {userToken.twitterUsername}</span>
          </A>
        )
      })}

      {searchText && searchText?.length > 0 && (
        <A
          href={`/desire/search?searchQuery=${searchText}`} 
          className="cursor-pointer flex items-center py-3 px-4 border-b border-gray-300 hover:bg-gray-300"
          //onClick={onClickDisconnectTwitter}
        >
          <span className="ml-2 font-medium">full search page</span>
        </A>
      )}
      
    </div>
  )
}
