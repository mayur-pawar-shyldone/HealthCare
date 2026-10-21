import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const from = join(root, 'Frontend', 'dist')
const to = join(root, 'Backend', 'public')

if (!existsSync(from)) {
  console.warn('Frontend dist not found; skipping static copy.')
  process.exit(0)
}

mkdirSync(to, { recursive: true })
cpSync(from, to, { recursive: true })
console.log(`Copied frontend build to ${to}`)
