"use client"

import toast from 'react-hot-toast'
import React, { useState, useContext } from 'react';
import Modal from 'components/modals/Modal';
import { GlobalContext } from 'lib/GlobalContext';
import { updateUserToken } from 'actions/users/apiUserActions';

const UserSettingsModal = ({
  close,
}: {
  close: () => void
}) => {
  const { userV2, setUserV2, jwtToken, } = useContext(GlobalContext)
  const [currentDisplayName, setCurrentDisplayName] = useState(userV2?.displayName ?? '')
  const [newDisplayName, setNewDisplayName] = useState('')

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const updatedUserToken = await updateUserToken({
      updatedDisplayName: newDisplayName,
      jwt: jwtToken as string,
    })

    if (!updatedUserToken) {
      toast.error(`failed to update display name`)
      return
    }

    setUserV2({
      ...userV2, // retain previous userV2 state
      id: updatedUserToken?.id,
      primaryWallet: updatedUserToken?.primaryWallet,
      displayName: updatedUserToken?.displayName,
      // userInfo remains unchanged
    })

    setCurrentDisplayName(newDisplayName)
  }

  return (
    <Modal close={close}>
      <div className="p-6 w-96 md:w-[30rem] text-white">

        <h2 className="text-2xl font-bold mb-4">edit display name</h2>

        <div>current: <span className="text-blue-500">{currentDisplayName}</span></div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
              display name
            </label>
            <input
              type="text"
              id="displayName"
              placeholder='enter new name...'
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
              className="block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              save
            </button>
          </div>
        </form>

      </div>
    </Modal>
  )
}

export default UserSettingsModal