import fs from 'fs'

const c = fs.readFileSync('C:/Users/Admin/Downloads/HealthID/HealthID/index.html', 'utf8')
for (const name of ['function rg(', 'const ng=', 'function pk(', 'function mk(']) {
  const start = c.indexOf(name)
  const next = c.indexOf('function ', start + name.length)
  console.log('\n===', name, '===\n')
  console.log(c.slice(start, start + 4500))
}
