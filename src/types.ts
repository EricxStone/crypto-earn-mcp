export interface PoolData {
  symbol: string
  tokenContractAddress: string
  liquidity: string
  liquidityUsd: string
  apr: string
}

export interface UserData {
  symbol: string
  tokenContractAddress: string
  poolLiquidity: string
  poolLiquidityUsd: string
  totalBalance: string
  totalBalanceUsd: string
  apr: string
}
