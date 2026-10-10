import fs from 'fs'
import vm from 'vm'

const c = fs.readFileSync('C:/Users/Admin/Downloads/HealthID/HealthID/index.html', 'utf8')
const xsStart = c.indexOf('const Xs=')
const xsEnd = c.indexOf(';const', xsStart + 10)
const xsCode = c.slice(xsStart, xsEnd + 1)
const Xs = vm.runInNewContext(xsCode.replace('const Xs=', 'Xs=') + '; Xs', {})
console.log(JSON.stringify(Xs, null, 2))

const rkStart = c.indexOf('function rk(')
console.log('\nrk snippet:\n', c.slice(rkStart, rkStart + 3500))

const tk = c.match(/const tk=\{[^}]+\}/)
const Zm = c.match(/const Zm=\[[^\]]+\]/)
const nk = c.match(/const nk=\[[^\]]+\]/)
console.log('\n', tk?.[0], '\n', Zm?.[0])
