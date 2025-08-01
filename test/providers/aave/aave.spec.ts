/* eslint-env jest */

import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { AaveProvider } from '../../../src/providers/aave/aave.js';
import { 
  mockUiPoolDataProvider, 
  mockUiIncentiveDataProvider,
  mockMarketDataProvider,
  mockUserDataProvider,
} from './mock.js';

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
    mockMarketDataProvider();
    mockUserDataProvider();
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

  test('should return user data', async() => {
    const provider = new AaveProvider('mainnet');
    
    const result = await provider.getUserData('0x0000000000000000000000000000000000000000');
    
    // Verify the result structure
    expect(result).toHaveLength(1);
    expect(result[0]['symbol']).toEqual('LINK');
  })
});

