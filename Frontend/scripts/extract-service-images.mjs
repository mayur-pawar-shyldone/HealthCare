import fs from 'fs'
import path from 'path'

const html = fs.readFileSync('C:/Users/Admin/Downloads/HealthID/HealthID/index.html', 'utf8')
const dir = path.join(process.cwd(), 'public/landing/services')
fs.mkdirSync(dir, { recursive: true })

const chunk = html.slice(html.indexOf('const Y2='), html.indexOf('function J2'))
const re = /id:"([^"]+)"[\s\S]*?image:"(data:image\/webp;base64,[^"]+)"/g
let m
while ((m = re.exec(chunk)) !== null) {
  const id = m[1]
  const b = Buffer.from(m[2].split(',')[1], 'base64')
  fs.writeFileSync(path.join(dir, `${id}.webp`), b)
  console.log('wrote', id, b.length)
}
