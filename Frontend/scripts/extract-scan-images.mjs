import fs from 'fs'
import path from 'path'

const html = fs.readFileSync('C:/Users/Admin/Downloads/HealthID/HealthID/index.html', 'utf8')
const dir = path.join(process.cwd(), 'public/landing/scans')
fs.mkdirSync(dir, { recursive: true })

const chunk = html.slice(html.indexOf('const tg='), html.indexOf('const ng='))
const re = /id:"([^"]+)"[\s\S]*?image:"(data:image\/webp;base64,[^"]+)"/g
let m
while ((m = re.exec(chunk)) !== null) {
  const b = Buffer.from(m[2].split(',')[1], 'base64')
  fs.writeFileSync(path.join(dir, `${m[1]}.webp`), b)
  console.log('wrote', m[1], b.length)
}
