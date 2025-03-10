"use client"

import { useContext } from 'react'
import toast from 'react-hot-toast'
import { GlobalContext } from 'lib/GlobalContext'
import A from 'components/A'
import useAuth from 'modules/users/hooks/useAuth'
import DefineUI from 'modules/symbol/components/DefineUI'
import BreadcrumbAccordion from './BreadcrumbAccordion'
import GoToContext from 'modules/place/components/GoToContext'
import { EMOTE_CONTEXTS, getContextPagePath } from 'modules/place/utils/ContextUtils'
import SavedPeopleUI from 'modules/users/components/SavedPeopleUI'


export default function DoStuffUI({
  close,
}: {
  close?: () => void
}) {
  const { jwtToken } = useContext(GlobalContext)
  const { handleParticleAndWhyspiaLogin, handleParticleAndWhyspiaDisconnect } = useAuth()

  const doStuffItems = [
    
    {
      label: 'simple options',
      content: (
        <div className="w-full flex flex-wrap justify-center">

          <A
            onClick={close ? () => close() : () => {}}
            href="/place/currently"
            className="w-full p-3 mb-4 mr-2 bg-[#1d8f89] text-white rounded-lg hover:bg-[#1d8f89]/50 cursor-pointer border border-white flex justify-center items-center"
          >
            <span className="block w-[20rem]"><span className="font-bold">CURRENTLY</span>: share with others what is current for you</span>
          </A>

          <A
            onClick={close ? () => close() : () => {}}
            href={`/place/notif`}
            className="w-full p-3 mb-4 mr-2 bg-[#1d8f89] text-white rounded-lg hover:bg-[#1d8f89]/50 cursor-pointer border border-white flex justify-center items-center"
          >
            <span className="block w-[20rem]"><span className="font-bold">NOTIF</span>: notify others with specific symbols. follow specific symbols of others</span>
          </A>

          <A
            onClick={close ? () => close() : () => {}}
            href="/place/thinking-about-u"
            className="w-full p-3 mb-4 mr-2 bg-[#1d8f89] text-white rounded-lg hover:bg-[#1d8f89]/50 cursor-pointer border border-white flex justify-center items-center"
          >
            <span className="block w-[20rem]"><span className="font-bold">TAU</span>: tell someone ur thinking about them or see if anyone is thinking about u</span>
          </A>

          <A
            onClick={close ? () => close() : () => {}}
            href="/place/nou"
            className="w-full p-3 mb-4 mr-2 bg-[#1d8f89] text-white rounded-lg hover:bg-[#1d8f89]/50 cursor-pointer border border-white flex justify-center items-center"
          >
            <span className="block w-[20rem]"><span className="font-bold">NoU</span>: send symbol (like &quot;hug&quot; or &quot;poke&quot;) back and forth with someone. grow streaks</span>
          </A>

        </div>
      )
    },

    {
      label: 'all options',
      children: [
        {
          label: 'travel to a place',
          content: (
            <GoToContext />
          )
        },
        {
          label: (
            <div className="">
              <div className="font-medium">your saved people list</div>
              <div className="text-xs">save new people here</div>
            </div>
          ),
          content: (
            <>
              {!jwtToken ? (
                <>
                  <div
                    onClick={handleParticleAndWhyspiaLogin}
                    className="relative h-full z-[500] flex justify-center items-center px-4 py-2 ml-2 text-xs font-bold text-white rounded-xl bg-[#1DA1F2] rounded-xl cursor-pointer"
                  >
                    login
                  </div>
                </>
              ) : (
                <SavedPeopleUI />
              )}
            </>
          )
        },
        {
          label: 'define symbol',
          content: (
            <>
              {!jwtToken ? (
                <>
                  <div
                    onClick={handleParticleAndWhyspiaLogin}
                    className="relative h-full z-[500] flex justify-center items-center px-4 py-2 ml-2 text-xs font-bold text-white rounded-xl bg-[#1DA1F2] rounded-xl cursor-pointer"
                  >
                    login
                  </div>
                </>
              ) : (
                <DefineUI jwtToken={jwtToken} />
              )}
            </>
          )
        },
        {
          label: 'search symbols or users',
          href: '/search',
          onClick: () => close ? close() : null,
        },
        {
          label: 'login',
          onClick: jwtToken ? () => toast.error(`ur already connected yo`) : handleParticleAndWhyspiaLogin,
        },
        {
          label: 'logout',
          onClick: jwtToken ? handleParticleAndWhyspiaDisconnect : () => toast.error(`ur already disconnected yo`),
        },
        {
          label: 'all pages',
          children: [
            {
              label: 'home page',
              href: '/',
              onClick: () => close ? close() : null,
            },
            {
              label: 'notifications page',
              href: '/notifications',
              onClick: () => close ? close() : null,
            },
            {
              label: 'all place pages',
              children: [
                {
                  label: EMOTE_CONTEXTS.TAU,
                  href: getContextPagePath(EMOTE_CONTEXTS.TAU),
                  onClick: () => close ? close() : null,
                },
                {
                  label: EMOTE_CONTEXTS.NOTIF,
                  href: getContextPagePath(EMOTE_CONTEXTS.NOTIF),
                  onClick: () => close ? close() : null,
                },
                {
                  label: EMOTE_CONTEXTS.NOU,
                  href: getContextPagePath(EMOTE_CONTEXTS.NOU),
                  onClick: () => close ? close() : null,
                },
                {
                  label: EMOTE_CONTEXTS.NO_CONTEXT,
                  href: getContextPagePath(EMOTE_CONTEXTS.NO_CONTEXT),
                  onClick: () => close ? close() : null,
                },
              ],
            },
            {
              label: 'search page',
              href: '/search',
              onClick: () => close ? close() : null,
            },
            {
              label: 'mission page',
              href: '/mission',
              onClick: () => close ? close() : null,
            },
            {
              label: 'about page',
              href: '/about',
              onClick: () => close ? close() : null,
            },
            {
              label: 'hug page',
              href: '/hug',
              onClick: () => close ? close() : null,
            },
            {
              label: 'dynamic pages',
              children: [
                {
                  label: 'user profile page',
                  href: '/user/whyspia',
                  onClick: () => close ? close() : null,
                },
                {
                  label: 'symbol page',
                  href: '/symbol/whyspia',
                  onClick: () => close ? close() : null,
                },
                {
                  label: 'planned ping page',
                  href: '/planned-ping/66bf9baf8f692399ce83c0b5',
                  onClick: () => close ? close() : null,
                },
              ],
            },
            {
              label: 'privacy policy page',
              href: '/privacy-policy',
              onClick: () => close ? close() : null,
            },
          ]
        }
      ],
    },
    {
      label: 'whyspia mission',
      href: '/mission',
      onClick: () => close ? close() : null
    },
    
  ]

  return (
    <div className="p-6 w-96 md:w-[31rem] text-white">

      <div className="text-2xl font-bold mb-6">home</div>

      <BreadcrumbAccordion items={doStuffItems} />

    </div>
  )
}
