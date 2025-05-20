[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/ragieai-ragie-mcp-server-badge.png)](https://mseep.ai/app/ragieai-ragie-mcp-server)

![image](https://github.com/user-attachments/assets/75e80f87-f39e-4f10-8c97-bbc848bbed82)


# Ragie Model Context Protocol Server

A Model Context Protocol (MCP) server that provides access to Ragie's knowledge base retrieval capabilities.

## Description

This server implements the Model Context Protocol to enable AI models to retrieve information from a Ragie knowledge base. It provides a single tool called "retrieve" that allows querying the knowledge base for relevant information.

## Prerequisites

- Node.js >= 18
- A Ragie API key

## Installation

The server requires the following environment variable:

- `RAGIE_API_KEY` (required): Your Ragie API authentication key

The server will start and listen on stdio for MCP protocol messages.

Install and run the server with npx:

```bash
RAGIE_API_KEY=your_api_key npx @ragieai/mcp-server
```

### Command Line Options

The server supports the following command line options:

- `--description, -d <text>`: Override the default tool description with custom text
- `--partition, -p <id>`: Specify the Ragie partition ID to query

Examples:

```bash
# With custom description
RAGIE_API_KEY=your_api_key npx @ragieai/mcp-server --description "Search the company knowledge base for information"

# With partition specified
RAGIE_API_KEY=your_api_key npx @ragieai/mcp-server --partition your_partition_id

# Using both options
RAGIE_API_KEY=your_api_key npx @ragieai/mcp-server --description "Search the company knowledge base" --partition your_partition_id
```

## Cursor Configuration

To use this MCP server with Cursor:

### Option 1: Create an MCP configuration file

1. Save a file called `mcp.json`

* **For tools specific to a project**, create a `.cursor/mcp.json` file in your project directory. This allows you to define MCP servers that are only available within that specific project.
* **For tools that you want to use across all projects**, create a `~/.cursor/mcp.json` file in your home directory. This makes MCP servers available in all your Cursor workspaces.

Example `mcp.json`:
```json
{
  "mcpServers": {
    "ragie": {
      "command": "npx",
      "args": [
        "-y",
        "@ragieai/mcp-server",
        "--partition",
        "optional_partition_id"
      ],
      "env": {
        "RAGIE_API_KEY": "your_api_key"
      }
    }
  }
}
```

### Option 2: Use a shell script

1. Save a file called `ragie-mcp.sh` on your system:
```bash
#!/usr/bin/env bash

export RAGIE_API_KEY="your_api_key"

npx -y @ragieai/mcp-server --partition optional_partition_id
```

2. Give the file execute permissions: `chmod +x ragie-mcp.sh`

3. Add the MCP server script by going to **Settings** -> **Cursor Settings** -> **MCP Servers** in the Cursor UI.

Replace `your_api_key` with your actual Ragie API key and optionally set the partition ID if needed.


## Claude Desktop Configuration

To use this MCP server with Claude desktop:

1. Create the MCP config file `claude_desktop_config.json`:

* For MacOS: Use `~/Library/Application Support/Claude/claude_desktop_config.json`
* For Windows: Use `%APPDATA%/Claude/claude_desktop_config.json`

Example `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "ragie": {
      "command": "npx",
      "args": [
        "-y",
        "@ragieai/mcp-server",
        "--partition",
        "optional_partition_id"
      ],
      "env": {
        "RAGIE_API_KEY": "your_api_key"
      }
    }
  }
}
```

Replace `your_api_key` with your actual Ragie API key and optionally set the partition ID if needed.

2. Restart Claude desktop for the changes to take effect.

The Ragie retrieval tool will now be available in your Claude desktop conversations.

## Features

### Retrieve Tool

The server provides a `retrieve` tool that can be used to search the knowledge base. It accepts the following parameters:

- `query` (string): The search query to find relevant information
- `topK` (number, optional, default: 8): The maximum number of results to return
- `rerank` (boolean, optional, default: true): Whether to try and find only the most relevant information
- `recencyBias` (boolean, optional, default: false): Whether to favor results towards more recent information

The tool returns:
- An array of content chunks containing matching text from the knowledge base

## Development

This project is written in TypeScript and uses the following main dependencies:
- `@modelcontextprotocol/sdk`: For implementing the MCP server
- `ragie`: For interacting with the Ragie API
- `zod`: For runtime type validation

### Development setup

Running the server in dev mode:

```bash
RAGIE_API_KEY=your_api_key npm run dev -- --partition optional_partition_id
```

Building the project:

```bash
npm run build
```

## License

MIT License - See LICENSE.txt for details.
