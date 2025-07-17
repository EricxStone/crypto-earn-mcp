import { PoolData, UserData } from '@/types.js'

export interface ProviderInterface {
  /**
   * Get liquidity and APR for a given coin
   * @param coin Symbol of the coin to query
   * @returns Promise resolving to a PoolData object
   */
  getLiquidityAndApr: (coin: string) => Promise<PoolData>

  /**
   * Get the list of available pools
   * @returns Promise resolving to an array of pool symbols
   */
  getAvailablePools: () => Promise<String[]>

  /**
   * Get user data for a given wallet address
   * @param walletAddress Ethereum address in checksum format
   * @returns Promise resolving to an array of UserData objects
   */
  getUserData: (walletAddress: string) => Promise<UserData[]>
}
