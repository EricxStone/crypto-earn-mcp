import { PoolData, UserData } from '@/types.js'

export interface ProviderInterface {
  getLiquidityAndApr: (coin: string) => Promise<PoolData>

  getAvailablePools: () => Promise<String[]>

  getUserData: (walletAddress: string) => Promise<UserData[]>
}
