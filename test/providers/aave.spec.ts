/* eslint-env jest */

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
    mockDataProvider();
  });
    

  test('should return liquidity and APR for pool', async () => {
    const provider = new AaveProvider('mainnet');
    
    const result = await provider.getLiquidityAndApr('DAI');
    
    // Verify the result structure
    expect(result).toHaveProperty('liquidity');
    expect(result).toHaveProperty('apr');
  });

  test('should return error for invalid pool', async () => {
    const provider = new AaveProvider('mainnet');
    
    await expect(provider.getLiquidityAndApr('INVALID_POOL')).rejects.toThrow('Pool not found');
  });

  test('should return available pool', async () => {
    const provider = new AaveProvider('mainnet');
    
    const result = await provider.getAvailablePools();
    
    // Verify the result structure
    expect(result).toHaveLength(2);
    expect(result).toEqual(['DAI', 'LINK']);
  });
});

function mockDataProvider() {
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
      {
        originalId: 1,
        id: '137-0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39-0xa97684ead0e402dc232d5a977953df7ecbab3cdb',
        underlyingAsset: '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39',
        name: 'ChainLink Token',
        symbol: 'LINK',
        decimals: 18,
        baseLTVasCollateral: '6600',
        reserveLiquidationThreshold: '7100',
        reserveLiquidationBonus: '10750',
        reserveFactor: '2000',
        usageAsCollateralEnabled: true,
        borrowingEnabled: true,
        isActive: true,
        isFrozen: false,
        liquidityIndex: '1011775815280751119101942966',
        variableBorrowIndex: '1056706857640728134304749079',
        liquidityRate: '1157396274448183239074078',
        variableBorrowRate: '15001646234457904143899116',
        lastUpdateTimestamp: 1751894819,
        aTokenAddress: '0x191c10Aa4AF7C30e871E70C95dB0E4eb77237530',
        variableDebtTokenAddress: '0x953A573793604aF8d41F306FEb8274190dB4aE0e',
        interestRateStrategyAddress: '0x56076f960980d453b5B749CB6A1c4D2E4e138B1A',
        availableLiquidity: '466785850477959673729497',
        totalScaledVariableDebt: '47147551265406444556585',
        priceInMarketReferenceCurrency: '1354965000',
        priceOracle: '0xd9FFdb71EbE7496cC440152d43986Aae0AB76665',
        variableRateSlope1: '70000000000000000000000000',
        variableRateSlope2: '3000000000000000000000000000',
        baseVariableBorrowRate: '0',
        optimalUsageRatio: '450000000000000000000000000',
        isPaused: false,
        debtCeiling: '0',
        borrowCap: '163702',
        supplyCap: '1600000',
        borrowableInIsolation: false,
        accruedToTreasury: '130191467757815037',
        unbacked: '0',
        isolationModeTotalDebt: '0',
        debtCeilingDecimals: 2,
        isSiloedBorrowing: false,
        flashLoanEnabled: true,
        virtualAccActive: true,
        virtualUnderlyingBalance: '466785843956116024794378'
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
    {
      id: '137-0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39-0xa97684ead0e402dc232d5a977953df7ecbab3cdb',
      underlyingAsset: '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39',
      aIncentiveData: {
        tokenAddress: '0x191c10Aa4AF7C30e871E70C95dB0E4eb77237530',
        incentiveControllerAddress: '0x929EC64c34a17401F460460D4B9390518E5B473e',
        rewardsTokenInformation: []
      },
      vIncentiveData: {
        tokenAddress: '0x953A573793604aF8d41F306FEb8274190dB4aE0e',
        incentiveControllerAddress: '0x929EC64c34a17401F460460D4B9390518E5B473e',
        rewardsTokenInformation: []
      }
    },
  ]);
}