import client from 'lib/axios'
import { 
  CurrentlyPlace,
  CurrentlyStatus,
  CurrentlyTag,
  CurrentlyUpdate, 
  CurrentlyUpdateTypes,
} from 'modules/places/currently/types/apiCurrentlyTypes'
import { 
  PlaceWithDuration,
  StatusWithDuration,
  TagWithDuration,
  getDurationMs 
} from 'modules/places/currently/types/durationTypes'

// Helper methods for creating CurrentlyUpdates
export const createPlaceUpdate = (place: CurrentlyPlace): CurrentlyUpdate => {
  return {
    updateType: CurrentlyUpdateTypes.NEW_PLACE,
    newValue: {
      text: place.text,
      duration: place.duration
    }
  }
}

export const createStatusUpdate = (status: CurrentlyStatus): CurrentlyUpdate => {
  return {
    updateType: CurrentlyUpdateTypes.NEW_STATUS,
    newValue: {
      text: status.text,
      duration: status.duration
    }
  }
}

export const createTagsUpdate = (
  newTags: CurrentlyTag[]
): CurrentlyUpdate[] => {
  const updates: CurrentlyUpdate[] = []

  newTags.forEach(tag => {
    updates.push({
      updateType: CurrentlyUpdateTypes.NEW_TAG,
      newValue: {
        tag: tag.tag,
        duration: tag.duration
      }
    })
  })

  return updates
}

/**
 * Create new Currently in DB
 */
export const apiCreateCurrently = async ({
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
    let response = await client.post(`/currently`, body, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    return response?.data?.data?.currently
  } catch (error) {
    console.error(`could not create new Currently`, error)
    return null
  }
}
