# Crypto Earn MCP Server

This is a MCP server that provides market data from earn providers. It will also be interacting with the smart contracts of the providers to deposit and withdraw assets.

## Prerequisites

- Node.js (v22 or later)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. Add the MCP server to your agent (e.g. Claude desktop)
```json
{
  "mcpServers": {
    "crypto-earn": {
      "command": "node",
      "args": [
        "...PATH_TO_PROJECT.../crypto-earn-mcp/dist/index.js"
      ],
    }
  }
}
```

If you are using nvm, use the following command to find the path to your node:
```bash
which node
```
Copy the path and replace "node" in `"command": "node"` with the path to your node.

4. Start using MCP

You can use prompt like `What is the APR of ETH on AAVE?`

## Features

| Feature | Description | Status |
|---------|-------------|--------|
| AAVE Market Data | Get market data from Aave | Done |
| Multi-chain supported | Support for multiple blockchain networks on AAVE | Done |
| User Data | Get user-specific data from Aave | In progress |
| Wallet Integration | Connect and interact with user wallets | Planned |
| Deposit/Withdraw | Interact with smart contracts for deposit and withdraw | Planned |
| Multi-provider support | Support for multiple providers | Planned |

## License

MIT
