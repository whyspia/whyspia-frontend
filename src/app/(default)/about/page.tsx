"use client"

import type { NextPage } from 'next'
import A from '../../../components/A'

const AboutHome: NextPage = () => {

  return (
    <div className="md:w-1/2 w-full mx-auto relative z-40">

      <div className="text-2xl font-bold text-center">what the heck is whyspia?</div>

      <div className="mt-6">

        <div className="mb-4">
          <A 
            href="/mission" 
            className="px-10 md:px-auto text-blue-500 font-medium hover:text-blue-700 transition-colors duration-200 ease-in-out hover:underline inline-flex items-center gap-1"
          >
            best understood by what we do. click here for the mission
            <span className="text-lg">→</span>
          </A>
        </div>

      </div>

    </div>
  )
}

export default AboutHome
