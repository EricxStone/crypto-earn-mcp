import { UiIncentiveDataProvider, UiPoolDataProvider } from '@aave/contract-helpers'
import { ethers } from 'ethers'
import { formatReserves, formatReservesAndIncentives, formatUserSummaryAndIncentives } from '@aave/math-utils'
import dayjs from 'dayjs'
import { PoolData, UserData } from '@/types.js'
import { ProviderInterface } from '../providerInterface.js'
import { resolveRpc } from '../resolver.js'
import { AaveUtil } from './aaveUtil.js'
import { AaveMarket } from './types.js'

export class AaveProvider implements ProviderInterface {
  provider: ethers.providers.JsonRpcProvider
  chainId: number
  poolDataProviderContract: UiPoolDataProvider
  incentiveDataProviderContract: UiIncentiveDataProvider
  contractNamespace: AaveMarket

  constructor (chainName: string) {
    this.chainId = AaveUtil.resolveChainID(chainName)
    this.provider = new ethers.providers.JsonRpcProvider(resolveRpc(this.chainId))
    this.contractNamespace = AaveUtil.resolveNamespace(this.chainId)
    this.poolDataProviderContract = new UiPoolDataProvider({
      uiPoolDataProviderAddress: this.contractNamespace.UI_POOL_DATA_PROVIDER,
      provider: this.provider,
      chainId: this.chainId
    })

    this.incentiveDataProviderContract = new UiIncentiveDataProvider({
      uiIncentiveDataProviderAddress:
              this.contractNamespace.UI_INCENTIVE_DATA_PROVIDER,
      provider: this.provider,
      chainId: this.chainId
    })
  }

  public async getLiquidityAndApr (coin: string): Promise<PoolData> {
    const [reserves, incentives] = await Promise.all([
      this.poolDataProviderContract.getReservesHumanized({
        lendingPoolAddressProvider: this.contractNamespace.POOL_ADDRESSES_PROVIDER
      }),
      this.incentiveDataProviderContract.getReservesIncentivesDataHumanized({
        lendingPoolAddressProvider: this.contractNamespace.POOL_ADDRESSES_PROVIDER
      })
    ])

    const currentTimestamp = dayjs().unix()

    const poolsData = formatReservesAndIncentives({
      reserves: reserves.reservesData,
      currentTimestamp,
      marketReferenceCurrencyDecimals: reserves.baseCurrencyData.marketReferenceCurrencyDecimals,
      marketReferencePriceInUsd: reserves.baseCurrencyData.marketReferenceCurrencyPriceInUsd,
      reserveIncentives: incentives
    })

    const poolData = poolsData.find((data) =>
      data.symbol.toUpperCase() === coin.toUpperCase() ||
            data.symbol.toUpperCase() === this.translateWrappedCoin(coin.toUpperCase())
    )

    if (poolData == null) {
      throw new Error(`Pool not found for ${coin}`)
    }

    return {
      symbol: poolData.symbol,
      tokenContractAddress: poolData.underlyingAsset,
      liquidity: poolData.totalLiquidity,
      liquidityUsd: poolData.totalLiquidityUSD,
      apr: poolData.supplyAPR
    }
  }

  public async getAvailablePools (): Promise<string[]> {
    const reserves = await this.poolDataProviderContract.getReservesHumanized({
      lendingPoolAddressProvider: this.contractNamespace.POOL_ADDRESSES_PROVIDER
    })

    const currentTimestamp = dayjs().unix()

    const poolsData = formatReserves({
      reserves: reserves.reservesData,
      currentTimestamp,
      marketReferenceCurrencyDecimals: reserves.baseCurrencyData.marketReferenceCurrencyDecimals,
      marketReferencePriceInUsd: reserves.baseCurrencyData.marketReferenceCurrencyPriceInUsd
    })

    return poolsData.map((pool) => pool.symbol)
  }

  public async getUserData (walletAddress: string): Promise<UserData[]> {
    const [reserves, incentives, userReserves, userIncentives] = await Promise.all([
      this.poolDataProviderContract.getReservesHumanized({
        lendingPoolAddressProvider: this.contractNamespace.POOL_ADDRESSES_PROVIDER
      }),
      this.incentiveDataProviderContract.getReservesIncentivesDataHumanized({
        lendingPoolAddressProvider: this.contractNamespace.POOL_ADDRESSES_PROVIDER
      }),
      this.poolDataProviderContract.getUserReservesHumanized({
        lendingPoolAddressProvider: this.contractNamespace.POOL_ADDRESSES_PROVIDER,
        user: walletAddress
      }),
      this.incentiveDataProviderContract.getUserReservesIncentivesDataHumanized({
        lendingPoolAddressProvider: this.contractNamespace.POOL_ADDRESSES_PROVIDER,
        user: walletAddress
      })
    ])

    const currentTimestamp = dayjs().unix()

    const formattedReserves = formatReserves({
      reserves: reserves.reservesData,
      currentTimestamp,
      marketReferenceCurrencyDecimals: reserves.baseCurrencyData.marketReferenceCurrencyDecimals,
      marketReferencePriceInUsd: reserves.baseCurrencyData.marketReferenceCurrencyPriceInUsd
    })

    const userSummary = formatUserSummaryAndIncentives({
      currentTimestamp,
      marketReferencePriceInUsd: reserves.baseCurrencyData.marketReferenceCurrencyPriceInUsd,
      marketReferenceCurrencyDecimals:
        reserves.baseCurrencyData.marketReferenceCurrencyDecimals,
      userReserves: userReserves.userReserves,
      formattedReserves,
      userEmodeCategoryId: userReserves.userEmodeCategoryId,
      reserveIncentives: incentives,
      userIncentives
    })

    const userData = userSummary.userReservesData.filter((data) =>
      parseFloat(data.underlyingBalance) > 0
    )

    return userData.map((data): UserData => ({
      symbol: data.reserve.symbol,
      tokenContractAddress: data.underlyingAsset,
      poolLiquidity: data.reserve.totalLiquidity,
      poolLiquidityUsd: data.reserve.totalLiquidityUSD,
      totalBalance: data.underlyingBalance,
      totalBalanceUsd: data.underlyingBalanceUSD,
      apr: data.reserve.supplyAPR
    }))
  }

  private translateWrappedCoin (coin: string): string {
    if (AaveUtil.wrappedCoinMap.has(coin)) {
      return AaveUtil.wrappedCoinMap.get(coin) as string
    }
    return coin
  }
}
