import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Ragie } from "ragie";
import { z } from "zod";

if (!process.env.RAGIE_API_KEY) throw new Error("RAGIE_API_KEY not set");
const RAGIE_API_KEY = process.env.RAGIE_API_KEY;
const RAGIE_PARTITION = process.env.RAGIE_PARTITION;

const server = new McpServer({ name: "ragie", version: "0.0.1" });

server.tool(
  "retrieve",
  `Look up information in the Knowledge Base. Use this tool when you need to:
 - Find relevant documents or information on specific topics
 - Retrieve company policies, procedures, or guidelines
 - Access product specifications or technical documentation
 - Get contextual information to answer company-specific questions
 - Find historical data or information about projects`,
  {
    query: z
      .string()
      .describe("The query to search for data in the Knowledge Base"),
  },
  async ({ query }) => {
    const ragie = new Ragie({ auth: RAGIE_API_KEY });
    const retrieval = await ragie.retrievals.retrieve({
      query,
      partition: RAGIE_PARTITION,
    });

    const content = retrieval.scoredChunks.map((sc) => ({
      type: "text" as const,
      text: sc.text,
    }));

    return { content };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Ragie MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
