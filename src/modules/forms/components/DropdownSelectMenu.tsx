import React, { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'


interface DropdownSelectMenuProps {
  options: string[]
  selectedOption: string
  setSelectedOption: (option: string) => void
}

const DropdownSelectMenu: React.FC<DropdownSelectMenuProps> = ({ options, selectedOption, setSelectedOption }) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleDropdown = () => setIsOpen(!isOpen)

  const newOptionClicked = (option: string) => {
    setSelectedOption(option)
    toggleDropdown()
  }

  return (
    // <select value={selectedOption} onChange={handleChange} className="p-2 rounded-lg">
    //   {options.map(option => (
    //     <option key={option} value={option} className="">
    //       {option}
    //     </option>
    //   ))}
    // </select>

    <div className="relative">
      <button className="p-3 mb-4 mr-2 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer flex items-center justify-between" onClick={toggleDropdown}>
        {selectedOption}
        {isOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full bg-white rounded shadow">
          {options.map(option => (
            <div key={option} className="p-3 text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => newOptionClicked(option)}>
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DropdownSelectMenu