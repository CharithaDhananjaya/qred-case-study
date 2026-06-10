import 'dotenv/config'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { searchApiDocs } from './tools/searchApiDocs'

const server = new McpServer({
  name: 'Qred Scout',
  version: '0.1.0',
})

const inputSchema = {
  query: z.string().describe('Natural language question about the Qred API'),
  maxResults: z.number().int().min(1).max(10).default(5).describe('Number of results to return'),
}

server.tool(
  'search_api_docs',
  'Search Qred API documentation. Returns relevant endpoint details including route, business context, business rules, parameters, and responses.',
  inputSchema,
  async ({ query, maxResults }: { query: string; maxResults: number }) => {
    const results = await searchApiDocs(query, maxResults)
    return {
      content: [{ type: 'text', text: results }],
    }
  }
)

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('Qred Scout MCP server running on stdio')
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
