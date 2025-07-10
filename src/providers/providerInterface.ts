import { PoolData } from '@/types.js'

export interface ProviderInterface {
  getLiquidityAndApr: (coin: string) => Promise<PoolData>

  getAvailablePools: () => Promise<String[]>
}
