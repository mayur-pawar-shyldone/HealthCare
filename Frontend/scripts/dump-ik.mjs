import fs from 'fs'

const c = fs.readFileSync('C:/Users/Admin/Downloads/HealthID/HealthID/index.html', 'utf8')
for (const name of ['function ik(', 'function rk(', 'const yl=', 'CHECKUP_TABS', 'function uk(']) {
  const start = c.indexOf(name)
  if (start < 0) continue
  console.log('\n===', name, 'at', start, '===\n')
  console.log(c.slice(start, start + 15000))
  break
}
// find ik only
const ikStart = c.indexOf('function ik(')
const ikEnd = c.indexOf('function ck(', ikStart)
console.log('\n=== ik full ===\n', c.slice(ikStart, ikEnd).slice(0, 8000))

const rkStart = c.indexOf('function rk(')
const rkEnd = c.indexOf('function uk(', rkStart)
console.log('\n=== rk full ===\n', c.slice(rkStart, rkEnd).slice(0, 12000))
