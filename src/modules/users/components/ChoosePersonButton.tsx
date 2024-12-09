import React from 'react'
import classNames from 'classnames'
import ModalService from 'components/modals/ModalService'
import ChoosePersonModal from 'modules/users/components/ChoosePersonModal'
import { SavedPerson, UserV2PublicProfile } from '../types/UserNameTypes'

const ChoosePersonButton = ({
  selectedPerson,
  setNewSelectedPerson
}:{
  selectedPerson: Partial<SavedPerson & UserV2PublicProfile>
  setNewSelectedPerson: (newSelectedPerson: Partial<SavedPerson & UserV2PublicProfile>) => void
}) => {
  return (
    <button
      onClick={() => ModalService.open(ChoosePersonModal, { setNewSelectedPerson })}
      className={classNames(
        "w-full p-4 text-xl text-left border-4",
        selectedPerson ? "border-[#1d8f89]" : "border-red-500",
        "shadow-lg rounded-lg mb-4 cursor-pointer"
      )}
    >
      {selectedPerson ? (
        <>
          <div className="w-full text-white/[.50] hover:text-white mb-2">change person to interact with...</div>
          <div className="p-3 rounded-lg bg-[#3a3a3a]">
            {selectedPerson.calculatedDisplayName && (<strong>{selectedPerson.calculatedDisplayName}</strong>)}
            <div>{selectedPerson.primaryWalletSaved}</div>
          </div>
        </>
      ) : (
        <div className="w-full text-white/[.50] hover:text-white">select person to interact with...</div>
      )}
    </button>
  )
}

export default ChoosePersonButton