/* eslint-disable @next/next/no-img-element */
import { Router, useRouter } from 'next/dist/client/router'
import { useState, useEffect, useRef } from 'react'
import { MenuIcon, XCircleIcon } from '@heroicons/react/solid'
import NProgress from 'nprogress'
import A from './A'
import classNames from 'classnames'
import { flatten } from 'lodash'
import AuthStatusWithConnectButton from 'modules/users/components/AuthStatusWithConnectButton'
import ModalService from './modals/ModalService'
import { SearchbarTooltipContent } from 'modules/no-category/components/SearchbarTooltipContent'
import { getAllUserTokens } from 'actions/users/apiUserActions'
import { useInfiniteQuery } from 'react-query'
import DoStuffModal from 'modules/no-category/components/DoStuffModal'

type MenuItemType = {
  name: string,
  value: string,
  onClick: () => void,
  isSelected: boolean,
}

export default function Header() {
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
    const userTokens = await getAllUserTokens({ search: searchBarQuery, skip: pageParam, limit: 3, orderBy: 'createdAt', orderDirection: 'desc' })
    return userTokens
  }

  const { data: infiniteUserTokens, fetchNextPage: fetchSearchNextPage, hasNextPage: hasSearchNextPage, isFetchingNextPage: isSearchFetchingNextPage } = useInfiniteQuery(
    ['search', 10, searchBarQuery],
    ({ pageParam = 0 }) =>
      fetchUserTokens({
        pageParam
      }),
    {
      enabled: Boolean(searchBarQuery && searchBarQuery?.length > 0), // disables query if this is not true
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
    NProgress.configure({ trickleSpeed: 100 })
  }, [])

  useEffect(() => {
    Router.events.on('routeChangeStart', () => NProgress.start())
    Router.events.on('routeChangeComplete', () => NProgress.done())
    Router.events.on('routeChangeError', () => NProgress.done())

    return () => {
      Router.events.on('routeChangeStart', () => NProgress.start())
      Router.events.on('routeChangeComplete', () => NProgress.done())
      Router.events.on('routeChangeError', () => NProgress.done())
    }
  }, [])

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
      <nav className="fixed top-0 z-[600] w-full px-4 md:px-8 shadow dark:bg-dark3 border-b dark:border-dark1">
        <div className="px-2 mx-auto transform max-w-88 md:max-w-304">
          <div className="relative flex items-center justify-between h-16">
            <div
              className="z-[600] flex items-center flex-shrink-0 cursor-pointer"
              onClick={() => router.push('/')}
            >
              {/* <img src="/ShmojiChibiTransparent.png" className="w-12" alt="shmoji-icon" /> */}
              <span className="w-auto h-full ml-2 text-2xl leading-none text-white md:text-3xl">
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
                // const previousPathname = window.location.pathname
                // window.history.pushState(null, null, '/desire')
                // ModalService.open(SendEmoteModal, {}, () => window.history.pushState(null, null, previousPathname))
                ModalService.open(DoStuffModal)
              }}
              className="bg-[#1d8f89] rounded-lg text-white px-4 py-2 font-bold cursor-pointer"
            >
              do stuff
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
                <MenuIcon
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
    </>
  )
}
