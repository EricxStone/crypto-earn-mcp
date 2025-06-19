import { AaveProvider } from "./aave/aave.js";
import { ProviderInterface } from "./providerInterface.js";

export const resolveProvider = (providerName: string): ProviderInterface => {
    switch(providerName) {
        case "aave":
            return new AaveProvider();
        default:
            throw new Error(`Provider not found for ${providerName}`);
    }
}