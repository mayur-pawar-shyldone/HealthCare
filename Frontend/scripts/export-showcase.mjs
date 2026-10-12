import fs from 'fs'

const c = fs.readFileSync('C:/Users/Admin/Downloads/HealthID/HealthID/index.html', 'utf8')
const okStart = c.indexOf(',ok=[')
const okEnd = c.indexOf('],$m=5', okStart)
const okBody = c.slice(okStart + ',ok='.length, okEnd + 1)
const ok = eval(okBody)
fs.writeFileSync('D:/Health_Cart_project/Frontend/src/data/landing-showcase-packages.json', JSON.stringify(ok, null, 2))
console.log('packages', ok.length, 'categories', [...new Set(ok.map((p) => p.category))])

const ckStart = c.indexOf('function ck(')
console.log('\nck+uk snippet:\n', c.slice(ckStart, ckStart + 6000))
