import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { resolveProvider } from "./providers/resolver.js";

// Create an MCP server 
const server = new McpServer({
  name: "crypto-earn",
  version: "1.0.0"
});

server.tool(
  "get-market-data",
  { 
    providerName: z.string(),
    chainName: z.string(),
    coin: z.string(),
  },
  async ({ providerName, coin, chainName }) => {
    const provider = resolveProvider(providerName, chainName);
    const data = await provider.getLiquidityAndApr(coin);
    return {
      content: [{
        type: "text",
        text: JSON.stringify(data)
      }]
    };
  }
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);