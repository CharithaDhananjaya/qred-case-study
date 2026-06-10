import * as fs from 'fs'
import * as path from 'path'

const ROUTES_DIR = path.resolve(__dirname, '../../../apps/backend/src/routes')
const OUT_DIR = path.resolve(__dirname, '../docs-output')

// Matches /** ... */ JSDoc blocks
const JSDOC_RE = /\/\*\*([\s\S]*?)\*\//g

// Strip the leading " * " prefix from each JSDoc line
function stripJsdocLines(body: string): string[] {
  return body.split('\n').map((l) => l.replace(/^\s*\*\s?/, '').trimEnd())
}

// Lines before the first @tag
function extractDescription(lines: string[]): string {
  const tagIndex = lines.findIndex((l) => l.trimStart().startsWith('@'))
  const descLines = tagIndex === -1 ? lines : lines.slice(0, tagIndex)
  return descLines.join('\n').trim()
}

// Multi-line block tag: collects all lines after @tag until the next @tag
function extractBlockTag(lines: string[], tag: string): string {
  const startIndex = lines.findIndex((l) => l.trimStart().startsWith(`@${tag}`))
  if (startIndex === -1) return ''

  const result: string[] = []
  for (let i = startIndex + 1; i < lines.length; i++) {
    if (lines[i].trimStart().startsWith('@')) break
    result.push(lines[i])
  }
  return result.join('\n').trim()
}

// Single-line tags like @param, @body, @returns, @throws
function extractInlineTags(lines: string[], tag: string): string[] {
  return lines
    .filter((l) => l.trimStart().startsWith(`@${tag}`))
    .map((l) => l.trimStart().replace(`@${tag}`, '').trim())
}

// @route value (e.g. "GET /cards/{id}")
function extractRoute(lines: string[]): string {
  const line = lines.find((l) => l.trimStart().startsWith('@route'))
  return line ? line.trimStart().replace('@route', '').trim() : ''
}

function jsdocToMarkdown(jsdocBody: string, sourceFile: string): string | null {
  const lines = stripJsdocLines(jsdocBody)
  const route = extractRoute(lines)
  if (!route) return null

  const description = extractDescription(lines)
  const businessContext = extractBlockTag(lines, 'businessContext')
  const businessRules = extractBlockTag(lines, 'businessRule')
  const params = extractInlineTags(lines, 'param')
  const body = extractInlineTags(lines, 'body')
  const returns = extractInlineTags(lines, 'returns')
  const throws = extractInlineTags(lines, 'throws')

  const out: string[] = []

  out.push(`# ${route}`, '')
  if (description) out.push(description, '')
  out.push(`**Source:** \`${path.basename(sourceFile)}\``, '')

  if (businessContext) out.push('## Business Context', '', businessContext, '')
  if (businessRules)   out.push('## Business Rules',   '', businessRules,   '')
  if (params.length)   out.push('## Query Parameters', '', ...params.map((p) => `- ${p}`), '')
  if (body.length)     out.push('## Request Body',     '', ...body.map((b) => `- ${b}`),   '')
  if (returns.length)  out.push('## Responses',        '', ...returns.map((r) => `- ${r}`), '')
  if (throws.length)   out.push('## Errors',           '', ...throws.map((t) => `- ${t}`),  '')

  return out.join('\n').trim()
}

function slugify(route: string): string {
  return route
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

  const routeFiles = fs
    .readdirSync(ROUTES_DIR)
    .filter((f) => f.endsWith('.route.ts'))
    .map((f) => path.join(ROUTES_DIR, f))

  let total = 0

  for (const file of routeFiles) {
    const source = fs.readFileSync(file, 'utf-8')
    for (const match of source.matchAll(JSDOC_RE)) {
      const md = jsdocToMarkdown(match[1], file)
      if (!md) continue

      const lines = stripJsdocLines(match[1])
      const route = extractRoute(lines)
      const filename = `${slugify(route)}.md`
      fs.writeFileSync(path.join(OUT_DIR, filename), md, 'utf-8')
      console.log(`  ✓  ${route}  →  docs-output/${filename}`)
      total++
    }
  }

  console.log(`\nExtracted ${total} endpoint(s) to ${OUT_DIR}`)
}

main()
