import { ChainId, UiIncentiveDataProvider, UiPoolDataProvider } from "@aave/contract-helpers";
import { ethers } from "ethers";
import * as markets from '@bgd-labs/aave-address-book';
import { formatReservesAndIncentives } from '@aave/math-utils';
import dayjs from 'dayjs';


export class AaveProvider {
    provider: ethers.providers.JsonRpcProvider;
    chainId: number;
    poolDataProviderContract: UiPoolDataProvider;
    incentiveDataProviderContract: UiIncentiveDataProvider;


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

    async getPoolReservesAndIncentives() {
        const reserves = await this.poolDataProviderContract.getReservesHumanized({
            lendingPoolAddressProvider: markets.AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
        });

        const incentives = await this.incentiveDataProviderContract.getReservesIncentivesDataHumanized({
            lendingPoolAddressProvider: markets.AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
        });

        const currentTimestamp = dayjs().unix();

        return formatReservesAndIncentives({
            reserves: reserves.reservesData,
            currentTimestamp,
            marketReferenceCurrencyDecimals: reserves.baseCurrencyData.marketReferenceCurrencyDecimals,
            marketReferencePriceInUsd: reserves.baseCurrencyData.marketReferenceCurrencyPriceInUsd,
            reserveIncentives: incentives,
        });
    } 
}