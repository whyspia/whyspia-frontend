export const formatWalletAddress = (address: string | undefined): string => {
  if (!address || typeof address !== 'string' || address.length < 10) {
    return 'invalid address'
  }
  return `0x${address.slice(2, 6)}...${address.slice(-4)}`
}
