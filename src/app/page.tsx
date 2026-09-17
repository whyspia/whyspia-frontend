import type { NextPage } from 'next'
import Image from 'next/image'
import WhyspiaLogo from '../../public/whyspia-logo-transbg.svg'

const Home: NextPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-dark3">
      <Image 
        src={WhyspiaLogo} 
        alt="whyspia-logo" 
        width={200} 
        height={200} 
        className="w-48 h-48"
      />
    </div>
  )
}

export default Home
