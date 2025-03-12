![image](https://github.com/user-attachments/assets/75e80f87-f39e-4f10-8c97-bbc848bbed82)


# Ragie Model Context Protocol Server

A Model Context Protocol (MCP) server that provides access to Ragie's knowledge base retrieval capabilities.

## Description

This server implements the Model Context Protocol to enable AI models to retrieve information from a Ragie knowledge base. It provides a single tool called "retrieve" that allows querying the knowledge base for relevant information.

## Prerequisites

- Node.js >= 18
- A Ragie API key
- (Optional) A Ragie partition ID

## Installation

The server requires the following environment variables:

- `RAGIE_API_KEY` (required): Your Ragie API authentication key
- `RAGIE_PARTITION` (optional): The Ragie partition ID to query

The server will start and listen on stdio for MCP protocol messages.

Install and run the server with npx:

```bash
RAGIE_API_KEY=your_api_key RAGIE_PARTITION=optional_partition_id npx @ragieai/mcp-server
```

## Cursor Configuration

To use this MCP server with Cursor:

1. Save a file called `mcp.json`

* **For tools specific to a project**, create a `.cursor/mcp.json` file in your project directory. This allows you to define MCP servers that are only available within that specific project.
* **For tools that you want to use across all projects**, create a `~/.cursor/mcp.json` file in your home directory. This makes MCP servers available in all your Cursor workspaces.

* Note that `RAGIE_PARTITION` is optional.

Example `mcp.json`:
```json
{
  "mcpServers": {
    "ragie": {
      "command": "npx",
      "args": [
        "-y",
        "@ragieai/mcp-server"
      ],
      "env": {
        "RAGIE_API_KEY": "your_api_key",
        "RAGIE_PARTITION": "optional_partition_id"
      }
    }
  }
}
```

Replace `your_api_key` with your actual Ragie API key and optionally set `RAGIE_PARTITION` if needed.


## Claude Desktop Configuration

To use this MCP server with Claude desktop:

1. Create the MCP config file `claude_desktop_config.json`:

* For MacOS: Use `~/Library/Application Support/Claude/claude_desktop_config.json`
* For Windows: Use `%APPDATA%/Claude/claude_desktop_config.json`

* Note that `RAGIE_PARTITION` is optional.

Example `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "ragie": {
      "command": "npx",
      "args": [
        "-y",
        "@ragieai/mcp-server"
      ],
      "env": {
        "RAGIE_API_KEY": "your_api_key",
        "RAGIE_PARTITION": "optional_partition_id"
      }
    }
  }
}
```

Replace `your_api_key` with your actual Ragie API key and optionally set `RAGIE_PARTITION` if needed.

2. Restart Claude desktop for the changes to take effect.

The Ragie retrieval tool will now be available in your Claude desktop conversations.

## Features

### Retrieve Tool

The server provides a `retrieve` tool that can be used to search the knowledge base. It accepts the following parameters:

- `query` (string): The search query to find relevant information

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
RAGIE_API_KEY=your_api_key RAGIE_PARTITION=optional_partition_id npm run dev
```

Building the project:

```bash
npm run build
```

## License

MIT License - See LICENSE.txt for details.
