import { ChainId, UiIncentiveDataProvider, UiPoolDataProvider } from "@aave/contract-helpers";
import { ethers } from "ethers";
import * as markets from '@bgd-labs/aave-address-book';
import { formatReservesAndIncentives } from '@aave/math-utils';
import dayjs from 'dayjs';
import { PoolData } from "@/types.js";
import { ProviderInterface } from "../providerInterface.js";


export class AaveProvider implements ProviderInterface {
    provider: ethers.providers.JsonRpcProvider;
    chainId: number;
    poolDataProviderContract: UiPoolDataProvider;
    incentiveDataProviderContract: UiIncentiveDataProvider;

    wrappedCoinMap: Map<string, string> = new Map(
        [['ETH', 'WETH'],
        ['BTC', 'WBTC']]
    );

    constructor() {
        this.provider = new ethers.providers.JsonRpcProvider("https://eth-mainnet.public.blastapi.io");
        this.chainId = ChainId.mainnet;
        this.poolDataProviderContract = new UiPoolDataProvider({
            uiPoolDataProviderAddress: markets.AaveV3Ethereum.UI_POOL_DATA_PROVIDER,
            provider: this.provider,
            chainId: this.chainId
        });

        this.incentiveDataProviderContract = new UiIncentiveDataProvider({
            uiIncentiveDataProviderAddress:
              markets.AaveV3Ethereum.UI_INCENTIVE_DATA_PROVIDER,
            provider: this.provider,
            chainId: this.chainId,
          });
    }

    public async getLiquidityAndApr(coin: string): Promise<PoolData> {
        const reserves = await this.poolDataProviderContract.getReservesHumanized({
            lendingPoolAddressProvider: markets.AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
        });

        const incentives = await this.incentiveDataProviderContract.getReservesIncentivesDataHumanized({
            lendingPoolAddressProvider: markets.AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
        });

        const currentTimestamp = dayjs().unix();

        const poolsData = formatReservesAndIncentives({
            reserves: reserves.reservesData,
            currentTimestamp,
            marketReferenceCurrencyDecimals: reserves.baseCurrencyData.marketReferenceCurrencyDecimals,
            marketReferencePriceInUsd: reserves.baseCurrencyData.marketReferenceCurrencyPriceInUsd,
            reserveIncentives: incentives,
        });

        const poolData = poolsData.find((data) => 
            data.symbol.toUpperCase() === coin.toUpperCase()
            || data.symbol.toUpperCase() === this.translateWrappedCoin(coin.toUpperCase())
        );

        if (!poolData) {
            throw new Error(`Pool not found for ${coin}`);
        }

        return {
            symbol: poolData.symbol,
            tokenContractAddress: poolData.underlyingAsset,
            liquidity: poolData.totalLiquidity,
            liquidityUsd: poolData.totalLiquidityUSD,
            apr: poolData.supplyAPR
        };
    }

    private translateWrappedCoin(coin: string): string {
        if (this.wrappedCoinMap.has(coin)) {
            return this.wrappedCoinMap.get(coin) as string;
        }
        return coin;
    }
}