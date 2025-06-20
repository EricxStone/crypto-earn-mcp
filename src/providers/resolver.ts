import { AaveProvider } from "./aave/aave.js";
import { ProviderInterface } from "./providerInterface.js";

export const resolveProvider = (providerName: string, chainName: string): ProviderInterface => {
    switch(providerName) {
        case "aave":
            return new AaveProvider(chainName);
        default:
            throw new Error(`Provider not found for ${providerName}`);
    }
}

export const resolveRpc = (chainId: number): string => {
    switch(chainId) {
        case 1:
            return "https://eth-mainnet.public.blastapi.io";
        case 137:
            return "https://polygon-mainnet.public.blastapi.io";
        case 100:
            return "https://gnosis-mainnet.public.blastapi.io";
        case 43114:
            return "https://avalanche-c-chain-rpc.publicnode.com";
        case 42161:
            return "https://arbitrum-one.public.blastapi.io";
        case 10:
            return "https://optimism-mainnet.public.blastapi.io";
        case 534352:
            return "https://scroll-mainnet.public.blastapi.io";
        case 8453:
            return "https://base-mainnet.public.blastapi.io";
        case 56:
            return "https://binance.llamarpc.com";
        case 324:
            return "https://mainnet.era.zksync.io";
        case 59144:
            return "https://rpc.linea.build";
        case 146:
            return "https://rpc.soniclabs.com";
        case 42220:
            return "https://celo.drpc.org";
        default:
            throw new Error(`Chain RPC not found for ${chainId}`);
    }
}