import { GoogleGenAI } from '@google/genai'
import { Pinecone } from '@pinecone-database/pinecone'

const genai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! })
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })

async function embedQuery(text: string): Promise<number[]> {
  const response = await genai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: text,
    config: { outputDimensionality: 768 },
  })
  return response.embeddings![0].values!
}

export async function searchApiDocs(query: string, maxResults = 5): Promise<string> {
  if (!process.env.PINECONE_INDEX_NAME) throw new Error('PINECONE_INDEX_NAME is not set')

  const index = pinecone.index(process.env.PINECONE_INDEX_NAME)
  const queryVector = await embedQuery(query)

  const results = await index.query({
    vector: queryVector,
    topK: maxResults,
    includeMetadata: true,
  })

  const matches = results.matches ?? []
  if (matches.length === 0) return 'No relevant API documentation found for your query.'

  return matches
    .map((match, i) => {
      const text = (match.metadata?.text as string) ?? ''
      const source = (match.metadata?.source as string) ?? 'unknown'
      const score = match.score?.toFixed(3) ?? 'n/a'
      return `## Result ${i + 1} (score: ${score})\nSource: ${source}\n\n${text}`
    })
    .join('\n\n---\n\n')
}
