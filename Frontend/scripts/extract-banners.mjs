import fs from 'fs'
import path from 'path'

const html = fs.readFileSync('C:/Users/Admin/Downloads/HealthID/HealthID/index.html', 'utf8')
const dir = path.join(process.cwd(), 'public/banners')
fs.mkdirSync(dir, { recursive: true })

const start = html.indexOf('const K2=')
const end = html.indexOf('];', start)
const chunk = html.slice(start, end + 2)
const idRe = /id:"(banner\d+)"/g
const ids = [...chunk.matchAll(idRe)].map((m) => m[1])

for (const id of ids) {
  const needle = `id:"${id}",image:"`
  const i = html.indexOf(needle)
  if (i < 0) continue
  const j = html.indexOf('",alt:', i)
  const dataUrl = html.slice(i + needle.length, j)
  if (!dataUrl.startsWith('data:image/webp;base64,')) continue
  const b = Buffer.from(dataUrl.split(',')[1], 'base64')
  fs.writeFileSync(path.join(dir, `${id}.webp`), b)
  console.log('wrote', id, b.length)
}
