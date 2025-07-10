import * as markets from '@bgd-labs/aave-address-book'

export type AaveMarket =
  | typeof markets.AaveV3Ethereum
  | typeof markets.AaveV3Polygon
  | typeof markets.AaveV3Gnosis
  | typeof markets.AaveV3Avalanche
  | typeof markets.AaveV3Arbitrum
  | typeof markets.AaveV3Optimism
  | typeof markets.AaveV3Scroll
  | typeof markets.AaveV3Base
  | typeof markets.AaveV3BNB
  | typeof markets.AaveV3ZkSync
  | typeof markets.AaveV3Linea
  | typeof markets.AaveV3Sonic
  | typeof markets.AaveV3Celo
