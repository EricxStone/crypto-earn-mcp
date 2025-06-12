import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { AaveProvider } from "./providers/aave/aave.js";
import { z } from "zod";

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
  },
  async ({ chainName }) => {
    console.log(chainName);
    const provider = new AaveProvider();
    const data = await provider.getPoolReservesAndIncentives();
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