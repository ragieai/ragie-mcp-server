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

```bash
npm install ragie-mcp
```

## Configuration

The server requires the following environment variables:

- `RAGIE_API_KEY` (required): Your Ragie API authentication key
- `RAGIE_PARTITION` (optional): The Ragie partition ID to query

## Usage

1. Build the project:

```bash
npm run build
```

2. Run the server:

```bash
RAGIE_API_KEY=your_api_key RAGIE_PARTITION=optional_partition_id ./build/index.js
```

The server will start and listen on stdio for MCP protocol messages.

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

## License

MIT License - See LICENSE.txt for details.
