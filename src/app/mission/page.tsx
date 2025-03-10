'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

interface MissionPoint {
    title: string
    description: string
    icon: string
}

const missionPoints: MissionPoint[] = [
    {
        title: "help people vibe with life",
        description: "• Our core question is: \"*do you feel aligned and connected enough with the people, places, and rhythms of your life?*\" - a more specific way of asking how much you vibe with life.\n\n• We're here to help those who dont feel aligned or connected enough. We cannot guarentee we help, but we can try. Often, this takes the form of helping people unlock their own agency.\n\n• The end goal is to vibe with life, which is a state where you feel that no change is needed in life, even when everything around you is changing or you are pursuing change.",
        icon: "🤝"
    },
    {
        title: "create self-sufficient home & community",
        description: "• Create and use our own tech stack: from hardware to software.\n\n• Our own Twitter, Instagram, AWS, phone hardware, network hardware, etc.\n\n• Same vibe as living off the land (we want to do that eventually too). We want to survive. We want to protect.\n\n• We want a home. We want a community. With roots in physical places, yet strong enough to transcend the physical.",
        icon: "🏡"
    },
    {
      title: "build a low-effort hangout spot",
      description: "• Build a low-effort hangout spot and community center.\n\n• Requires no money spent for visitors.\n\n• Requires no traditional socializing.\n\n> do your own thing, with other people close...(or just chat, we are not your mom)\n\n• Similar to: coffeeshop, computer lab, Student Union, community center.\n\n• Ideally, there is both explicit quiet areas and nonquiet areas.\n\n• Both in the physical world and a version in cyberspace.",
      icon: "🏯"
    },
    {
        title: "learn, create, share, experiment, play",
        description: "• We want to learn. We want to create. Because we simply enjoy it.\n\n• Resonance or participation is never guarenteed, but we strive to be a community where you can share, experiment, and play with new ideas or creations.",
        icon: "🧠"
    },
    {
        title: "give and receive quests",
        description: "• A quest can be anything; for example: \"*the first 3 people to do a backflip in front of me all get $50.*\"\n\n• There can be no money involved or you can reward people for completing your quests.\n\n• Then, at scale you have frens making money by taking quests from frens. Making money from all kinds of niche stuff that no one has ever made money from before. Making this a norm in the community could jumpstart an exciting future.\n\n• This can be done completely word of mouth; however, we plan to create technology for posting, viewing, and accepting quests.",
        icon: "🧙‍♂️"
    },
    {
        title: "build home & community in cyberspace",
        description: "• Build a home in cyberspace.\n\n• Build a community in cyberspace. A digital commons is part of this.\n\n• Rooted in the physical home and community of whyspia, yet independent and more accessible.\n\n• Ideally, create multiple forms of interface with our physical world: simple chat apps, current status apps, 2D worlds, 3D worlds, VR worlds, AR worlds...and connecting them together in interesting ways if desired.",
        icon: "🌐"
    },
    
]

export default function MissionPage() {
    const [currentPoint, setCurrentPoint] = useState(0)

    const nextPoint = () => {
        if (currentPoint < missionPoints.length - 1) {
            setCurrentPoint(currentPoint + 1)
        }
    }

    const previousPoint = () => {
        if (currentPoint > 0) {
            setCurrentPoint(currentPoint - 1)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="mb-4 sm:mb-6 text-center flex flex-col items-center">
                  <span className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                    whyspia mission
                  </span>
                  <span className="text-xs sm:text-sm font-light text-purple-300 mt-2 tracking-wider">
                    what we do
                  </span>
                </h1>

                <div className="relative min-h-[400px] sm:min-h-[500px] bg-black/20 rounded-xl p-4 sm:p-8 backdrop-blur-sm overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPoint}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="h-full flex flex-col justify-center"
                        >
                            <div className="text-6xl sm:text-6xl mb-6 sm:mb-8 text-center">
                                {missionPoints[currentPoint].icon}
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-purple-300 px-2">
                                {missionPoints[currentPoint].title}
                            </h2>
                            <p className="text-lg sm:text-xl text-left leading-relaxed whitespace-pre-line px-2 sm:px-8">
                                <ReactMarkdown
                                    components={{
                                        strong: ({ children }) => <span className="font-bold text-white">{children}</span>,
                                        em: ({ children }) => <span className="italic text-purple-200">{children}</span>,
                                        blockquote: ({ children }) => (
                                            <div className="my-2 pl-4 border-l-2 border-purple-400/50 text-purple-200/90 italic">
                                                {children}
                                            </div>
                                        ),
                                    }}
                                >
                                    {missionPoints[currentPoint].description}
                                </ReactMarkdown>
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="mt-6 sm:mt-8 flex justify-between items-center px-2">
                    <button
                        onClick={previousPoint}
                        disabled={currentPoint === 0}
                        className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base"
                    >
                        previous
                    </button>

                    <div className="flex gap-2">
                        {missionPoints.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPoint(index)}
                                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all hover:scale-125 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent ${
                                    index === currentPoint
                                        ? 'bg-purple-400'
                                        : 'bg-white/30 hover:bg-white/50'
                                }`}
                                aria-label={`Go to point ${index + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={nextPoint}
                        disabled={currentPoint === missionPoints.length - 1}
                        className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base"
                    >
                        next
                    </button>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => window.open('https://github.com/whyspia/whyspia-journal-and-docs/blob/main/mission.md', '_blank')}
                        className="text-sm text-purple-300 hover:text-purple-200 transition-colors underline underline-offset-4 opacity-75 hover:opacity-100"
                    >
                        view entire mission on one page
                    </button>
                </div>
            </div>
        </div>
    )
} 