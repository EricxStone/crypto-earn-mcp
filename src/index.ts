#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { resolveProvider } from './providers/resolver.js'
import { ethers } from 'ethers'
import { WalletConnect } from './wallet/walletConnect.js'

// Create an MCP server
const server = new McpServer({
  name: 'crypto-earn',
  version: '1.0.0'
})

server.tool(
  'get-market-data',
  {
    providerName: z.string(),
    chainName: z.string(),
    coin: z.string()
  },
  async ({ providerName, coin, chainName }) => {
    const provider = resolveProvider(providerName, chainName)
    const data = await provider.getLiquidityAndApr(coin)
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(data)
      }]
    }
  }
)

server.tool(
  'get-available-pools',
  {
    providerName: z.string(),
    chainName: z.string()
  },
  async ({ providerName, chainName }) => {
    const provider = resolveProvider(providerName, chainName)
    const pools = await provider.getAvailablePools()
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(pools)
      }]
    }
  }
)

server.tool(
  'get-user-data',
  {
    providerName: z.string(),
    chainName: z.string(),
    walletAddress: z.custom<`0x${string}`>((val) => {
      try {
        ethers.utils.getAddress(val)
        return true
      } catch (error) {
        return false
      }
    })
  },
  async ({ providerName, chainName, walletAddress }) => {
    const provider = resolveProvider(providerName, chainName)
    const data = await provider.getUserData(walletAddress)
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(data)
      }]
    }
  }
)

server.tool(
  'connect-wallet',
  {},
  async () => {
    const walletConnect = new WalletConnect()
    const walletConnectUri = await walletConnect.connect()
    if (walletConnectUri === '') {
      return {
        content: [{
          type: 'text',
          text: 'Wallet has been connected'
        }]
      }
    }
    // return {
    //   content: [{
    //     type: 'image',
    //     data: walletConnectUri,
    //     mimeType: 'image/png',
    //     altText: 'Scan this QR code to connect your wallet'
    //   }]
    // }
    return {
      content: [{
        type: 'text',
        text: walletConnectUri
      }]
    }
  }
)

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport()
await server.connect(transport)
