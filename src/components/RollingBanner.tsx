import { useEffect, useState, useRef } from 'react'

interface RollingBannerProps {
  text: string
  speed?: number
}

export default function RollingBanner({ text, speed = 50 }: RollingBannerProps) {
  const [position, setPosition] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [textWidth, setTextWidth] = useState(0)

  useEffect(() => {
    const updateWidths = () => {
      if (containerRef.current && textRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
        setTextWidth(textRef.current.offsetWidth)
      }
    }
    
    updateWidths()
    window.addEventListener('resize', updateWidths)
    return () => window.removeEventListener('resize', updateWidths)
  }, [])

  useEffect(() => {
    const animate = () => {
      setPosition((prev) => {
        // When first text is completely off screen, reset to start
        if (prev <= -textWidth) {
          return containerWidth
        }
        return prev - 1
      })
    }

    const interval = setInterval(animate, speed)
    return () => clearInterval(interval)
  }, [speed, containerWidth, textWidth])

  return (
    <div 
      ref={containerRef}
      className="bg-[#1d8f89] overflow-hidden h-6 fixed top-16 w-full z-[599]"
    >
      <div 
        ref={textRef}
        className="text-white text-xs font-medium whitespace-nowrap absolute flex items-center h-full"
        style={{ transform: `translateX(${position}px)` }}
      >
        {text}
      </div>
    </div>
  )
} 