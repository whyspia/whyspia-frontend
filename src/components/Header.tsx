"use client"

/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef, useContext } from 'react'
import { Bars3Icon, XCircleIcon } from '@heroicons/react/24/solid'
import A from './A'
import classNames from 'classnames'
import { flatten } from 'lodash'
import AuthStatusWithConnectButton from 'modules/users/components/AuthStatusWithConnectButton'
import ModalService from './modals/ModalService'
import { SearchbarTooltipContent } from 'modules/no-category/components/SearchbarTooltipContent'
import { getAllUserTokens } from 'actions/users/apiUserActions'
import { useInfiniteQuery } from 'react-query'
import DoStuffModal from 'modules/no-category/components/DoStuffModal'
import { GlobalContext } from 'lib/GlobalContext'
import Image from 'next/image'
import WhyspiaLogo from '../../public/whyspia-logo-transbg.svg'
import DiscordLogo from '../../public/discord.svg'
import RollingBanner from './RollingBanner'
import { SOCIAL_LINKS } from 'lib/constants'

type MenuItemType = {
  name: string,
  value: string,
  onClick: () => void,
  isSelected: boolean,
}

export default function Header() {
  const { jwtToken, isJwtLoadingFinished } = useContext(GlobalContext)

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const router = useRouter()
  const closeMenu = () => setIsMobileNavOpen(false)
  const menuItems: MenuItemType[] = []

  const [searchBarQuery, setSearchBarQuery] = useState('')
  const [desktopTooltipVisibility, setDesktopTooltipVisibility] = useState(false)
  const [mobileTooltipVisibility, setMobileTooltipVisibility] = useState(false)
  const desktopSearchBarRef = useRef(null)
  const mobileSearchBarRef = useRef(null)

  const fetchUserTokens = async ({ pageParam = 0 }) => {
    const userTokens = await getAllUserTokens({ search: searchBarQuery, skip: pageParam, limit: 3, orderBy: 'createdAt', orderDirection: 'desc', jwt: jwtToken })
    return userTokens
  }

  const { data: infiniteUserTokens, fetchNextPage: fetchSearchNextPage, hasNextPage: hasSearchNextPage, isFetchingNextPage: isSearchFetchingNextPage } = useInfiniteQuery(
    ['search', searchBarQuery],
    ({ pageParam = 0 }) =>
      fetchUserTokens({
        pageParam
      }),
    {
      enabled: (Boolean(searchBarQuery && searchBarQuery?.length > 0) && isJwtLoadingFinished), // disables query if this is not true
      getNextPageParam: (lastGroup, allGroups) => {
        const morePagesExist = lastGroup?.length === 10

        if (!morePagesExist) {
          return false
        }

        return allGroups.length * 10
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  )

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (desktopSearchBarRef.current && !desktopSearchBarRef.current.contains(event.target)) {
        setDesktopTooltipVisibility(false)
      } else {
        setDesktopTooltipVisibility(true)
      }
      if (mobileSearchBarRef.current && !mobileSearchBarRef.current.contains(event.target)) {
        setMobileTooltipVisibility(false)
      } else {
        setMobileTooltipVisibility(true)
      }
    }
  
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const onSearchBarTyped = (symbol: string) => {
    setSearchBarQuery(symbol)
  }

  const userTokens = flatten(infiniteUserTokens?.pages || [])

  return (
    <>
      <nav className="fixed top-0 z-[600] w-full h-[65px] px-4 md:px-8 shadow dark:bg-dark3 border-b dark:border-dark1">
        <div className="px-2 mx-auto transform max-w-88 md:max-w-304">
          <div className="relative flex items-center justify-between h-16">
            <div
              className="z-[600] flex items-center flex-shrink-0 cursor-pointer"
              onClick={() => router.push('/')}
            >
              <Image 
                src={WhyspiaLogo} 
                alt="whyspia-logo" 
                width={32} 
                height={32} 
                className="w-10 h-10"
              />
              <span className="w-auto h-full ml-2 mb-1 text-xl leading-none text-white md:text-2xl hidden lg:inline-block">
                whyspia
              </span>
            </div>

            <div className="absolute hidden w-full space-x-8 text-center md:inline">
              {menuItems.map((menuItem) => (
                <A
                  key={menuItem.value}
                  onClick={() => {
                    menuItem.onClick()
                    closeMenu()
                  }}
                  className={classNames(
                    'cursor-pointer inline-flex items-center px-1 text-lg font-medium leading-5 tracking-tighter transition duration-150 ease-in-out focus:outline-none focus:text-gray-700 focus:border-gray-300',
                    menuItem.isSelected
                      ? 'text-white'
                      : 'text-brand-gray text-opacity-60 hover:text-brand-gray-2'
                  )}
                >
                  {menuItem.name}
                </A>
              ))}
            </div>

            {/* Send button */}
            <div
              onClick={() => {
                ModalService.open(DoStuffModal)
              }}
              className="bg-[#1d8f89] rounded-lg text-white px-4 py-2 font-bold cursor-pointer"
            >
              do stuff
            </div>

            {/* Discord logo - desktop only */}
            <div className="hidden sm:block relative">
              <div 
                onClick={() => window.open(SOCIAL_LINKS.DISCORD, '_blank')}
                className="mx-4 cursor-pointer group"
              >
                <Image
                  src={DiscordLogo}
                  alt="Discord"
                  width={32}
                  height={32}
                  className="transition-all duration-200 hover:opacity-80 hover:scale-110"
                />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-sm py-1 px-2 rounded whitespace-nowrap">
                  join community
                </div>
              </div>
            </div>

            <div className="relative z-[600]" ref={desktopSearchBarRef}>
              
              <input
                type="text"
                value={searchBarQuery}
                onChange={(e) => onSearchBarTyped(e.target.value)}
                placeholder="Search"
                className="hidden md:block w-[30rem] border border-gray-300 rounded px-3 py-2"
              />
              {desktopTooltipVisibility && (
                <div
                  onClick={() => setDesktopTooltipVisibility(false)}
                  className="absolute h-[10rem] w-full inset-y-0 left-0 top-full text-sm text-black rounded-xl shadow bg-white overflow-auto z-[600]"
                >
                  <SearchbarTooltipContent userTokens={userTokens} searchText={searchBarQuery} />
                </div>
              )}
            </div>

            <AuthStatusWithConnectButton />

            <div className="flex items-center -mr-2 md:hidden">
              <button
                className="inline-flex items-center justify-center p-2 text-gray-400 transition duration-150 ease-in-out rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500"
                aria-label="Main menu"
                aria-expanded="false"
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              >
                <Bars3Icon
                  className={classNames(
                    'w-6 h-6',
                    isMobileNavOpen ? 'hidden' : 'block'
                  )}
                />
                <XCircleIcon
                  className={classNames(
                    'w-6 h-6',
                    isMobileNavOpen ? 'block' : 'hidden'
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        <div
          className={classNames(
            'md:hidden',
            isMobileNavOpen ? 'block' : 'hidden'
          )}
        >
          <div className="pt-2 pb-3 text-center">
            {/* {menuItems.map((menuItem) => (
              <A
                onClick={() => {
                  menuItem.onClick()
                  closeMenu()
                }}
                key={menuItem.value}
                className={classNames(
                  'cursor-pointer block py-2 pl-3 pr-4 mt-1 text-base font-medium transition duration-150 ease-in-out border-l-4 border-transparent hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300',
                  menuItem.isSelected
                    ? 'text-white'
                    : 'text-brand-gray text-opacity-60'
                )}
              >
                {menuItem.name}
              </A>
            ))} */}

            {/* Add Discord for mobile */}
            <div 
              onClick={() => window.open(SOCIAL_LINKS.DISCORD, '_blank')}
              className="flex items-center justify-center space-x-2 py-3 cursor-pointer 
                hover:bg-gray-700 mx-4 my-2 rounded-lg border border-gray-600 
                transition-all duration-200 active:bg-gray-600"
            >
              <Image
                src={DiscordLogo}
                alt="Discord"
                width={24}
                height={24}
              />
              <span className="text-white">join Discord Community</span>
            </div>

            <div className="relative z-[600]" ref={mobileSearchBarRef}>
              
              <input
                type="text"
                value={searchBarQuery}
                onChange={(e) => onSearchBarTyped(e.target.value)}
                placeholder="Search"
                className="md:hidden block w-full border border-gray-300 rounded px-3 py-2"
              />
              {mobileTooltipVisibility && (
                <div
                  onClick={() => setMobileTooltipVisibility(false)}
                  className="absolute h-[10rem] w-full inset-y-0 left-0 top-full text-sm text-black rounded-xl shadow bg-white overflow-auto z-[600]"
                >
                  <SearchbarTooltipContent userTokens={userTokens} searchText={searchBarQuery} />
                </div>
              )}
            </div>
            
          </div>
        </div>
      </nav>
      {/* <RollingBanner text="welcome to whyspia ••• data storage and privacy is stinky poo poo rn. help us fix pls...we are thinking of IPFS and Lit Protocol ••• backend servers are down, so no functionality works right now sadly" speed={20} /> */}
    </>
  )
}
