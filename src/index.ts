#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { resolveProvider } from './providers/resolver.js'
import { ethers } from 'ethers'
import { WalletConnect } from './wallet/walletConnect.js'
import { exec } from 'child_process'
import { QrServer } from './wallet/qrServer.js'

// Global server instance for QR code display
let qrServer: any = null

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
      // Close QR server if wallet is already connected
      if (qrServer !== null) {
        qrServer.close()
        qrServer = null
      }
      return {
        content: [{
          type: 'text',
          text: 'Wallet has been connected'
        }]
      }
    }
    // Create HTTP server if not already running
    if (qrServer === null) {
      qrServer = new QrServer().create(walletConnectUri)
      qrServer.listen(3000)
    }
    // Open browser to display QR code
    exec('open http://localhost:3000/qr', (error) => {
      if (error !== null) {
        console.log('Could not open browser automatically. Please visit: http://localhost:3000/qr')
      }
    })
    return {
      content: [{
        type: 'text',
        text: '🌐 **Wallet Connection QR Code**\n\nA browser window has opened with your wallet connection QR code.\n\n**Manual access:** http://localhost:3000/qr\n\nScan the QR code with your wallet app to connect. The page will auto-refresh until connection is established.'
      }]
    }
  }
)

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport()
await server.connect(transport)
