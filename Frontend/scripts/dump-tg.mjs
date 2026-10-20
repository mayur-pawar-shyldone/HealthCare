import fs from 'fs'

const c = fs.readFileSync('C:/Users/Admin/Downloads/HealthID/HealthID/index.html', 'utf8')
const start = c.indexOf('const tg=')
const end = c.indexOf('const ng=', start)
const chunk = c.slice(start, end)
// crude: find object literals
const ids = [...chunk.matchAll(/id:"([^"]+)"/g)].map((m) => m[1])
console.log('ids', ids)
console.log(chunk.slice(0, 8000))
