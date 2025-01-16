import client from 'lib/axios'
import { 
  CurrentlyUpdate, 
  CurrentlyUpdateTypes 
} from 'modules/places/currently/types/apiCurrentlyTypes'

// Helper methods for creating CurrentlyUpdates
export const updatePlaceText = (newText: string, shouldSavePlaceOnShare = false): CurrentlyUpdate => {
  return {
    updateType: CurrentlyUpdateTypes.EDIT_PLACE_TEXT,
    newValue: newText,
    shouldSavePlaceOnShare,
  }
}

export const updatePlaceDuration = (duration: number, shouldSavePlaceOnShare = false): CurrentlyUpdate => {
  return {
    updateType: CurrentlyUpdateTypes.EDIT_PLACE_DURATION,
    newValue: duration,
    shouldSavePlaceOnShare,
  }
}

export const deletePlace = (): CurrentlyUpdate => {
  return {
    updateType: CurrentlyUpdateTypes.DELETE_PLACE
  }
}

export const updateTagText = (oldText: string, newText: string): CurrentlyUpdate => {
  return {
    updateType: CurrentlyUpdateTypes.EDIT_TAG_TEXT,
    target: oldText,
    newValue: newText
  }
}

export const updateTagDuration = (tagText: string, duration: number): CurrentlyUpdate => {
  return {
    updateType: CurrentlyUpdateTypes.EDIT_TAG_DURATION,
    target: tagText,
    newValue: duration
  }
}

export const deleteTag = (tagText: string): CurrentlyUpdate => {
  return {
    updateType: CurrentlyUpdateTypes.DELETE_TAG,
    target: tagText
  }
}

export const updateStatusText = (newText: string): CurrentlyUpdate => {
  return {
    updateType: CurrentlyUpdateTypes.EDIT_STATUS_TEXT,
    newValue: newText
  }
}

export const updateStatusDuration = (duration: number): CurrentlyUpdate => {
  return {
    updateType: CurrentlyUpdateTypes.EDIT_STATUS_DURATION,
    newValue: duration
  }
}

export const deleteStatus = (): CurrentlyUpdate => {
  return {
    updateType: CurrentlyUpdateTypes.DELETE_STATUS
  }
}

export const clearAll = (): CurrentlyUpdate => {
  return {
    updateType: CurrentlyUpdateTypes.CLEAR_ALL
  }
}

/**
 * update Currently in DB
 */
export const apiUpdateCurrently = async ({
  jwt,
  updates,
}: {
  jwt: string
  updates: CurrentlyUpdate[]
}) => {
  const body = {
    updates,
  }

  try {
    let response = await client.put(`/currently/update`, body, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    return response?.data?.data?.updatedCurrently
  } catch (error) {
    console.error(`could not update Currently`, error)
    return null
  }
}
