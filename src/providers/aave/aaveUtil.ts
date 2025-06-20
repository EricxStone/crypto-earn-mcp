import { ChainId } from "@aave/contract-helpers";
import * as markets from '@bgd-labs/aave-address-book';
import { AaveMarket } from "./types.js";



export class AaveUtil {
    static wrappedCoinMap: Map<string, string> = new Map(
        [
            ['ETH', 'WETH'],
            ['BTC', 'WBTC'],
            ['POL', 'WPOL'],
        ]
    );

    public static resolveChainID(chainName: string): number {
        switch (chainName.toLowerCase()) {
            case "ethereum":
            case "eth":
            case "mainnet":
            case "ethereum mainnet":
                return ChainId.mainnet;
            case "polygon":
            case "matic":
                return ChainId.polygon;
            case "xdai":
            case "gnosis":
                return ChainId.xdai;
            case "avalanche":
            case "avax":
            case "avalanche c chain":
                return ChainId.avalanche;
            case "arbitrum":
            case "arbitrum one":
                return ChainId.arbitrum_one;
            case "optimism":
            case "op":
                return ChainId.optimism;
            case "scroll":
                return ChainId.scroll;
            case "base":
            case "base chain":
                return ChainId.base;
            case "bnb":
            case "binance":
            case "bsc":
            case "binance smart chain":
                return ChainId.bnb;
            case "zksync":
            case "zksync era":
                return ChainId.zksync;
            case "linea":
                return ChainId.linea;
            case "sonic":
                return ChainId.sonic;
            case "celo":
                return ChainId.celo;
            default:
                throw new Error(`Chain not found for ${chainName}`);
        }
    }

    public static resolveNamespace(chainId: number): AaveMarket {
        switch (chainId) {
            case ChainId.mainnet:
                return markets.AaveV3Ethereum;
            case ChainId.polygon:
                return markets.AaveV3Polygon;
            case ChainId.xdai:
                return markets.AaveV3Gnosis;
            case ChainId.avalanche:
                return markets.AaveV3Avalanche;
            case ChainId.arbitrum_one:
                return markets.AaveV3Arbitrum;
            case ChainId.optimism:
                return markets.AaveV3Optimism;
            case ChainId.scroll:
                return markets.AaveV3Scroll;
            case ChainId.base:
                return markets.AaveV3Base;
            case ChainId.bnb:
                return markets.AaveV3BNB;
            case ChainId.zksync:
                return markets.AaveV3ZkSync;
            case ChainId.linea:
                return markets.AaveV3Linea;
            case ChainId.sonic:
                return markets.AaveV3Sonic;
            case ChainId.celo:
                return markets.AaveV3Celo;
            default:
                throw new Error(`Contract namespace not found for ${chainId}`);
        }
    }
}