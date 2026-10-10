import fs from 'fs'

const c = fs.readFileSync('C:/Users/Admin/Downloads/HealthID/HealthID/index.html', 'utf8')
const start = c.indexOf('const Xs=')
const end = c.indexOf(',ek="Member special rates')
const body = c.slice(start + 'const Xs='.length, end)
// eslint-disable-next-line no-eval
const Xs = eval(body)
fs.writeFileSync('D:/Health_Cart_project/Frontend/src/data/landing-checkup-tabs.json', JSON.stringify(Xs, null, 2))
console.log('tabs', Xs.length, 'first tab packages', Xs[0].packages.map((p) => p.name))
