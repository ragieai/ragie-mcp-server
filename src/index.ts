#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Ragie } from "ragie";
import { z } from "zod";
import { Command } from "commander";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

if (!process.env.RAGIE_API_KEY) throw new Error("RAGIE_API_KEY not set");
const RAGIE_API_KEY = process.env.RAGIE_API_KEY;

// Get package version from package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJsonPath = join(__dirname, "..", "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const packageVersion = packageJson.version;

// Parse command line arguments
const program = new Command();
program
  .version(packageVersion, "-v, --version", "output the current version")
  .option(
    "-d, --description [description]",
    "override the default tool description"
  )
  .option("-p, --partition [partition]", "specify the Ragie partition to use")
  .parse(process.argv);

const options = program.opts();

const server = new McpServer({ name: "ragie", version: "1.0.0" });

// Default tool description
const defaultDescription = `Look up information in the Knowledge Base. Use this tool when you need to:
 - Find relevant documents or information on specific topics
 - Retrieve company policies, procedures, or guidelines
 - Access product specifications or technical documentation
 - Get contextual information to answer company-specific questions
 - Find historical data or information about projects`;

if (options.partition) {
  console.error("Using partition", options.partition);
}

// Use the provided description if available, otherwise use the default
if (options.description) {
  console.error("Using overridden description");
}
const description = options.description || defaultDescription;

server.tool(
  "ragie_retrieve",
  description,
  {
    query: z
      .string()
      .describe("The query to search for data in the Knowledge Base"),
    topK: z
      .number()
      .describe("The maximum number of results to return. Defaults to 8.")
      .optional()
      .default(8),
    rerank: z
      .boolean()
      .describe(
        "Whether to try and find only the most relevant data. Defaults to true. If no relevant data is found, try again with this parameter set to false."
      )
      .optional()
      .default(true),
    recencyBias: z
      .boolean()
      .describe(
        "Whether to favor data towards more recent documents. Defaults to false."
      )
      .optional()
      .default(false),
  },
  async ({ query, topK, rerank, recencyBias }) => {
    const ragie = new Ragie({ auth: RAGIE_API_KEY });
    const retrieval = await ragie.retrievals.retrieve({
      query,
      topK,
      rerank,
      recencyBias,
      partition: options.partition,
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
