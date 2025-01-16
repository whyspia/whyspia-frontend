// these types are on backend too, so important for changes here to happen on backend and vice versa (prob better for change to happen on backend first)

import { UserV2PublicProfile } from "modules/users/types/UserNameTypes"

export type CurrentlyPlace = {
  text: string
  duration: number
  updatedDurationAt: Date
}

export type CurrentlyTag = {
  tag: string
  duration: number
  updatedDurationAt: Date
}

export type CurrentlyStatus = {
  text: string
  duration: number
  updatedDurationAt: Date
}

export type CurrentlyUpdate = {
  updateType: string
  newValue?: any
  target?: string
  shouldSavePlaceOnShare?: boolean
}

export const CurrentlyUpdateTypes = {
  EDIT_PLACE_TEXT: 'editPlaceText',
  EDIT_PLACE_DURATION: 'editPlaceDuration',
  NEW_PLACE: 'newPlace',
  DELETE_PLACE: 'deletePlace',
  NEW_TAG: 'newTag',
  EDIT_TAG_TEXT: 'editTagText',
  EDIT_TAG_DURATION: 'editTagDuration',
  DELETE_TAG: 'deleteTag',
  NEW_STATUS: 'newStatus',
  EDIT_STATUS_TEXT: 'editStatusText',
  EDIT_STATUS_DURATION: 'editStatusDuration',
  DELETE_STATUS: 'deleteStatus',
  CLEAR_ALL: 'clearAll',
}
export type CurrentlyUpdateTypesValues = typeof CurrentlyUpdateTypes[keyof typeof CurrentlyUpdateTypes]

export type CurrentlyResponse = {
  id: string
  senderPrimaryWallet: string
  senderUser: UserV2PublicProfile
  place: CurrentlyPlace
  wantOthersToKnowTags: CurrentlyTag[]
  status: CurrentlyStatus
  createdAt: Date
}
