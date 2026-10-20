import fs from 'fs'
import path from 'path'

const html = fs.readFileSync('C:/Users/Admin/Downloads/HealthID/HealthID/index.html', 'utf8')
const dir = path.join(process.cwd(), 'public/landing')
fs.mkdirSync(dir, { recursive: true })

for (const varName of ['eg', 'yk']) {
  const marker = `const ${varName}=`
  const i = html.indexOf(marker)
  if (i < 0) {
    console.log('skip', varName)
    continue
  }
  const dataStart = html.indexOf('data:image', i)
  const dataEnd = html.indexOf('"', dataStart)
  const dataUrl = html.slice(dataStart, dataEnd)
  const b = Buffer.from(dataUrl.split(',')[1], 'base64')
  fs.writeFileSync(path.join(dir, `${varName}.webp`), b)
  console.log('wrote', varName, b.length)
}
