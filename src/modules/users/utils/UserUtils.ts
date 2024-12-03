import { SavedPerson, UserV2PublicProfile } from "../types/UserNameTypes"

export const convertSavedPersonToUserProfile = (savedPerson: SavedPerson): UserV2PublicProfile => {
  return {
    id: savedPerson.id,
    primaryWallet: savedPerson.primaryWalletSaved,
    chosenPublicName: savedPerson.chosenName,
    calculatedDisplayName: savedPerson.calculatedDisplayName,
    requestingPrimaryWallet: savedPerson?.primaryWalletSavedUser?.requestingPrimaryWallet,
    isRequestedUserSavedByRequestingUser: savedPerson?.primaryWalletSavedUser?.isRequestedUserSavedByRequestingUser,
  }
}