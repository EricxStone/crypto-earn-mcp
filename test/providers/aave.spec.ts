import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { AaveProvider } from '../../src/providers/aave/aave.js';

// Mock the Aave contract helpers

const mockUiPoolDataProvider = {
  getReservesHumanized: jest.fn<(...args: any[]) => Promise<any>>(),
};

const mockUiIncentiveDataProvider = {
  getReservesIncentivesDataHumanized: jest.fn<(...args: any[]) => Promise<any>>(),
};

jest.mock('@aave/contract-helpers', () => ({
  UiPoolDataProvider: jest.fn().mockImplementation(() => mockUiPoolDataProvider),
  UiIncentiveDataProvider: jest.fn().mockImplementation(() => mockUiIncentiveDataProvider),
  ChainId: {
    mainnet: 1,
  }
}));

describe('AaveProvider', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup default mocks for the contract methods
    mockUiPoolDataProvider.getReservesHumanized.mockResolvedValue({
      reservesData: [
        {
          originalId: 0,
          id: '137-0x8f3cf7ad23cd3cadbd9735aff958023239c6a063-0xa97684ead0e402dc232d5a977953df7ecbab3cdb',
          underlyingAsset: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
          name: '(PoS) Dai Stablecoin',
          symbol: 'DAI',
          decimals: 18,
          baseLTVasCollateral: '0',
          reserveLiquidationThreshold: '7700',
          reserveLiquidationBonus: '10500',
          reserveFactor: '2500',
          usageAsCollateralEnabled: false,
          borrowingEnabled: true,
          isActive: true,
          isFrozen: false,
          liquidityIndex: '1157341507815450735577504876',
          variableBorrowIndex: '1246354639933580045710500200',
          liquidityRate: '42212567851829900700003482',
          variableBorrowRate: '75022612287677334948970370',
          lastUpdateTimestamp: 1751894357,
          aTokenAddress: '0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE',
          variableDebtTokenAddress: '0x8619d80FB0141ba7F184CbF22fd724116D9f7ffC',
          interestRateStrategyAddress: '0x56076f960980d453b5B749CB6A1c4D2E4e138B1A',
          availableLiquidity: '1597841391667124185007464',
          totalScaledVariableDebt: '3850290214425192866904047',
          priceInMarketReferenceCurrency: '99978530',
          priceOracle: '0xa1913Df228db08F02F3F3Dc0f397Af3A2d2f96A1',
          variableRateSlope1: '90000000000000000000000000',
          variableRateSlope2: '400000000000000000000000000',
          baseVariableBorrowRate: '0',
          optimalUsageRatio: '900000000000000000000000000',
          isPaused: false,
          debtCeiling: '0',
          borrowCap: '16000000',
          supplyCap: '18000000',
          borrowableInIsolation: true,
          accruedToTreasury: '67977603334749705300',
          unbacked: '0',
          isolationModeTotalDebt: '0',
          debtCeilingDecimals: 2,
          isSiloedBorrowing: false,
          flashLoanEnabled: true,
          virtualAccActive: true,
          virtualUnderlyingBalance: '1597680495689333440291006'
        },
      ],
      baseCurrencyData: {
        marketReferenceCurrencyDecimals: 8,
        marketReferenceCurrencyPriceInUsd: '100000000',
        networkBaseTokenPriceInUsd: '18618345',
        networkBaseTokenPriceDecimals: 8
      }
    });

    mockUiIncentiveDataProvider.getReservesIncentivesDataHumanized.mockResolvedValue([
      {
        id: '137-0x8f3cf7ad23cd3cadbd9735aff958023239c6a063-0xa97684ead0e402dc232d5a977953df7ecbab3cdb',
        underlyingAsset: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
        aIncentiveData: {
          tokenAddress: '0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE',
          incentiveControllerAddress: '0x929EC64c34a17401F460460D4B9390518E5B473e',
          rewardsTokenInformation: []
        },
        vIncentiveData: {
          tokenAddress: '0x8619d80FB0141ba7F184CbF22fd724116D9f7ffC',
          incentiveControllerAddress: '0x929EC64c34a17401F460460D4B9390518E5B473e',
          rewardsTokenInformation: []
        }
      },
    ]);
  });

  test('should return liquidity and APR for ETH', async () => {
    const provider = new AaveProvider('mainnet');
    
    const result = await provider.getLiquidityAndApr('DAI');
    
    // Verify the result structure
    expect(result).toHaveProperty('liquidity');
    expect(result).toHaveProperty('apr');
  });
});