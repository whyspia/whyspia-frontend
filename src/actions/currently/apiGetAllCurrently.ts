import client from 'lib/axios'
import { CurrentlyResponse } from 'modules/places/currently/types/apiCurrentlyTypes'

type GetAllCurrentlyInput = {
  jwt: null | string
  skip: number
  limit: number
  orderBy: string
  orderDirection: string
  search?: null | string
  senderPrimaryWallet?: null | string
  anyActiveField?: boolean
  anyActivePlace?: boolean
  placeName?: null | string
}

/**
 * get all Currently
 */
export default async function apiGetAllCurrently({
  jwt,
  skip,
  limit,
  orderBy,
  orderDirection,
  search = null,
  senderPrimaryWallet = null,
  anyActiveField = null,
  anyActivePlace = null,
  placeName = null,
}: GetAllCurrentlyInput): Promise<CurrentlyResponse[]> {

  try {
    const response = await client.get(`/currently`, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
      params: {
        skip,
        limit,
        orderBy,
        orderDirection,
        search,
        senderPrimaryWallet,
        anyActiveField,
        anyActivePlace,
        placeName,
      },
    })

    return response?.data?.data?.currentlyList
  } catch (error) {
    console.error('could not get all Currently', error)
    return []
  }
}

// these methods below arent even really needed, but their name makes more obvious what is going on in kinda big way

/**
 * get all Currently that are active at all
 */
export async function apiGetAllCurrentlyWithAnyActiveField({
  jwt,
  skip,
  limit,
  orderBy,
  orderDirection,
  search = null,
  senderPrimaryWallet = null,
  placeName = null,
}: GetAllCurrentlyInput): Promise<CurrentlyResponse[]> {

  try {
    const response = await client.get(`/currently`, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
      params: {
        skip,
        limit,
        orderBy,
        orderDirection,
        search,
        senderPrimaryWallet,
        anyActiveField: true,
        placeName,
      },
    })

    return response?.data?.data?.currentlyList
  } catch (error) {
    console.error('could not get all CurrentlyWithAnyActiveField', error)
    return []
  }
}

/**
 * get all Currently that are active at a place
 */
export async function apiGetAllCurrentlyWithAnyActivePlace({
  jwt,
  skip,
  limit,
  orderBy,
  orderDirection,
  search = null,
  senderPrimaryWallet = null,
  placeName = null,
}: GetAllCurrentlyInput): Promise<CurrentlyResponse[]> {

  try {
    const response = await client.get(`/currently`, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
      params: {
        skip,
        limit,
        orderBy,
        orderDirection,
        search,
        senderPrimaryWallet,
        anyActivePlace: true,
        placeName,
      },
    })

    return response?.data?.data?.currentlyList
  } catch (error) {
    console.error('could not get all CurrentlyWithAnyActivePlace', error)
    return []
  }
}
