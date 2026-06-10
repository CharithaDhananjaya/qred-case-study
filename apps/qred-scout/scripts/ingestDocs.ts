import 'dotenv/config'
import * as fs from 'fs'
import * as path from 'path'
import { GoogleGenAI } from '@google/genai'
import { Pinecone } from '@pinecone-database/pinecone'

const DOCS_DIR = path.resolve(__dirname, '../docs-output')

const genai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! })
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })

async function embedText(text: string): Promise<number[]> {
  const response = await genai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: text,
    config: { outputDimensionality: 768 },
  })
  return response.embeddings![0].values!
}

async function main() {
  if (!process.env.GOOGLE_API_KEY)   throw new Error('GOOGLE_API_KEY is not set')
  if (!process.env.PINECONE_API_KEY) throw new Error('PINECONE_API_KEY is not set')
  if (!process.env.PINECONE_INDEX_NAME) throw new Error('PINECONE_INDEX_NAME is not set')

  const index = pinecone.index(process.env.PINECONE_INDEX_NAME)

  if (!fs.existsSync(DOCS_DIR)) {
    throw new Error(`docs-output/ not found — run yarn extract-docs first`)
  }

  const files = fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith('.md'))
  if (files.length === 0) throw new Error('No .md files found in docs-output/')

  console.log(`Embedding and upserting ${files.length} document(s)...\n`)

  for (const file of files) {
    const text = fs.readFileSync(path.join(DOCS_DIR, file), 'utf-8')
    const values = await embedText(text)

    await index.upsert([
      {
        id: file.replace('.md', ''),
        values,
        metadata: { text, source: file },
      },
    ])

    console.log(`  ✓  ${file}`)
  }

  console.log(`\nIngested ${files.length} document(s) into Pinecone index "${process.env.PINECONE_INDEX_NAME}"`)
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
