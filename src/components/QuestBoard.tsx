"use client"

import { useState } from 'react'
import Image from 'next/image'
import WhyspiaLogo from '../../public/whyspia-logo-transbg.svg'

interface QuestBoardProps {
  quest: string
  reward: string
  from: string
  acceptedBy: string
  status: string
  onStatusChange: (status: string) => void
}

export default function QuestBoard({ 
  quest,
  reward, 
  from, 
  acceptedBy, 
  status, 
  onStatusChange 
}: QuestBoardProps) {
  return (
    <div className="w-full max-w-[300px] bg-dark3 border-2 border-[#1d8f89] rounded-lg p-3 mx-auto my-3 shadow-lg">
      {/* Header */}
      <div className="text-white font-bold text-center py-1 px-2 rounded mb-2 flex justify-center items-center">
        <Image 
          src={WhyspiaLogo} 
          alt="whyspia-logo" 
          width={32} 
          height={32} 
          className="w-14 h-14"
        />
      </div>

      {/* Quest Section */}
      <div className="bg-dark2 border border-[#1d8f89] rounded p-2 mb-2 hover:bg-dark3 transition-colors duration-200">
        <div className="text-[#1d8f89] font-bold text-sm mb-0.5">QUEST:</div>
        <div className="text-white text-sm leading-tight">{quest}</div>
      </div>

      {/* Reward Section */}
      <div className="bg-dark2 border border-[#1d8f89] rounded p-2 mb-2 hover:bg-dark3 transition-colors duration-200">
        <div className="text-[#1d8f89] font-bold text-sm mb-0.5">REWARD:</div>
        <div className="text-white text-sm leading-tight">{reward}</div>
      </div>

      {/* From & Accepted By in same row */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="bg-dark2 border border-[#1d8f89] rounded p-2 hover:bg-dark3 transition-colors duration-200">
          <div className="text-[#1d8f89] font-bold text-sm mb-0.5">FROM:</div>
          <div className="text-white text-sm truncate">{from}</div>
        </div>

        <div className="bg-dark2 border border-[#1d8f89] rounded p-2 hover:bg-dark3 transition-colors duration-200">
          <div className="text-[#1d8f89] font-bold text-sm mb-0.5">ACCEPTED BY:</div>
          <div className="text-white text-sm truncate">{acceptedBy}</div>
        </div>
      </div>

      {/* Status Section */}
      <div className="bg-dark2 border border-[#1d8f89] rounded p-2 hover:bg-dark3 transition-colors duration-200">
        <div className="text-[#1d8f89] font-bold text-sm mb-0.5">STATUS:</div>
        <select 
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full p-1 rounded bg-dark3 border border-[#1d8f89] text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#1d8f89] transition-all duration-200"
        >
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>
    </div>
  )
} 