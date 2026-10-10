import fs from 'fs'
import vm from 'vm'

const c = fs.readFileSync('C:/Users/Admin/Downloads/HealthID/HealthID/index.html', 'utf8')
const start = c.indexOf('const tg=')
const end = c.indexOf('];', start) + 2
const code = c.slice(start, end).replace(/^const tg=/, 'tg=')
const tg = vm.runInNewContext(code + '; tg', {})
console.log(JSON.stringify(tg.map(({ id, name, originalPrice, offerPrice, description, features }) => ({ id, name, originalPrice, offerPrice, description, features })), null, 2))
