"use client"

import Image from 'next/image'
import { SOCIAL_LINKS } from 'lib/constants'
import DiscordLogo from '../../public/discord.svg'
import XLogo from '../../public/x-logo-white.svg'
import GitHubLogo from '../../public/github-mark-white.svg'

export default function Footer() {
  return (
    <footer className="w-full bg-dark3 border-t border-dark1 mt-auto">
      <div className="max-w-304 mx-auto px-4 py-4">
        <div className="flex justify-center items-center space-x-8">
          {/* Discord */}
          <div className="group relative">
            <div 
              onClick={() => window.open(SOCIAL_LINKS.DISCORD, '_blank')}
              className="cursor-pointer p-2 rounded-lg hover:bg-gray-700 transition-all duration-200"
            >
              <Image
                src={DiscordLogo}
                alt="Discord"
                width={32}
                height={32}
                className="transition-all duration-200 hover:scale-110"
              />
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-sm py-1 px-2 rounded whitespace-nowrap">
                join community
              </div>
            </div>
          </div>

          {/* X (Twitter) */}
          <div className="group relative">
            <div 
              onClick={() => window.open(SOCIAL_LINKS.X, '_blank')}
              className="cursor-pointer p-2 rounded-lg hover:bg-gray-700 transition-all duration-200"
            >
              <Image
                src={XLogo}
                alt="X (Twitter)"
                width={24}
                height={24}
                className="transition-all duration-200 hover:scale-110"
              />
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-sm py-1 px-2 rounded whitespace-nowrap">
                follow us on X
              </div>
            </div>
          </div>

          {/* GitHub */}
          <div className="group relative">
            <div 
              onClick={() => window.open(SOCIAL_LINKS.GITHUB, '_blank')}
              className="cursor-pointer p-2 rounded-lg hover:bg-gray-700 transition-all duration-200"
            >
              <Image
                src={GitHubLogo}
                alt="GitHub"
                width={28}
                height={28}
                className="transition-all duration-200 hover:scale-110"
              />
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-sm py-1 px-2 rounded whitespace-nowrap">
                whyspia on GitHub
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 