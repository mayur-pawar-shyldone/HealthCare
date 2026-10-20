import fs from 'fs'

const c = fs.readFileSync('C:/Users/Admin/Downloads/HealthID/HealthID/index.html', 'utf8')
const start = c.indexOf('function gk(')
const end = c.indexOf('function xk(', start)
if (start < 0 || end < 0) {
  console.error('gk not found', start, end)
  process.exit(1)
}
console.log(c.slice(start, Math.min(start + 12000, end)))
