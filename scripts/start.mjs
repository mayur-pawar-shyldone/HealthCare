import { createHash } from 'node:crypto'
import { writeFileSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { join } from 'node:path'

function firstEnv(...keys) {
  for (const key of keys) {
    const value = process.env[key]
    if (value && value.trim()) return value.trim()
  }
  return ''
}

function mysqlUrlFromParts() {
  const user = firstEnv('MYSQLUSER', 'MYSQL_USER')
  const password = firstEnv('MYSQLPASSWORD', 'MYSQL_PASSWORD')
  const host = firstEnv('MYSQLHOST', 'MYSQL_HOST', 'MYSQL_PRIVATE_HOST')
  const port = firstEnv('MYSQLPORT', 'MYSQL_PORT') || '3306'
  const database = firstEnv('MYSQLDATABASE', 'MYSQL_DATABASE', 'MYSQL_DB')
  if (!user || !host || !database) return ''
  return `mysql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`
}

function relatedEnvKeys() {
  return Object.keys(process.env)
    .filter((key) =>
      /^(DATABASE|MYSQL|MARIA|POSTGRES|PG|DB_|JWT_|RAILWAY_SERVICE)/i.test(key),
    )
    .sort()
}

function describeValue(raw) {
  if (raw == null) return 'missing'
  const value = String(raw)
  if (!value.trim()) return `empty (${value.length} chars)`
  if (/\$\{\{/.test(value)) return 'unresolved Railway template (MySQL service name is wrong or MySQL was not created)'
  if (/^postgres(ql)?:\/\//i.test(value)) return 'postgres URL (this app needs MySQL)'
  if (/^mysql:\/\//i.test(value)) return `mysql URL (${value.length} chars)`
  return `set but not a mysql:// URL (${value.length} chars)`
}

function usableDatabaseUrl(raw) {
  const value = String(raw || '').trim()
  if (!value) return ''
  if (/\$\{\{/.test(value)) return ''
  return value
}

function ensureDatabaseUrl() {
  const existing = usableDatabaseUrl(
    firstEnv(
      'DATABASE_URL',
      'MYSQL_URL',
      'MYSQL_PRIVATE_URL',
      'MYSQL_DATABASE_URL',
      'MYSQL_PUBLIC_URL',
    ),
  )
  process.env.DATABASE_URL = existing || mysqlUrlFromParts()
  if (process.env.DATABASE_URL) return

  const service = process.env.RAILWAY_SERVICE_NAME || 'this app service'
  console.error(`
DATABASE_URL on ${service}: ${describeValue(process.env.DATABASE_URL)}
MYSQL_URL on ${service}: ${describeValue(process.env.MYSQL_URL)}
Visible keys: ${relatedEnvKeys().join(', ') || '(none)'}

The HealthCare service has the DATABASE_URL name, but no MySQL connection string.
The canvas must show TWO cards: HealthCare and MySQL. One card is not enough.

Fix in Railway:
1. Canvas → + New → Database → MySQL. Wait until that card is Running.
2. Open the MySQL card → Variables. Confirm MYSQL_URL looks like mysql://...
3. Open the HealthCare card → Variables → DATABASE_URL.
4. Delete the current DATABASE_URL if it is blank.
5. New Variable → click the variable-reference picker (do not type this by hand if the picker exists):
     DATABASE_URL  =  MYSQL_URL from the MySQL card
6. The value must become a mysql://... URL, not blank and not \${{MySQL.MYSQL_URL}} as leftover text.
7. Railway redeploys by itself after save.
`)
  process.exit(1)
}

function ensureJwtSecrets() {
  const seed = firstEnv('RAILWAY_PROJECT_ID', 'RAILWAY_ENVIRONMENT_ID') || 'healthcart'
  if (!firstEnv('JWT_ACCESS_SECRET')) {
    process.env.JWT_ACCESS_SECRET = createHash('sha256').update(`access:${seed}`).digest('hex')
  }
  if (!firstEnv('JWT_REFRESH_SECRET')) {
    process.env.JWT_REFRESH_SECRET = createHash('sha256').update(`refresh:${seed}`).digest('hex')
  }
}

function writePrismaEnv() {
  writeFileSync(
    join(process.cwd(), 'Backend', '.env'),
    `DATABASE_URL=${process.env.DATABASE_URL}\n`,
    { encoding: 'utf8' },
  )
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', env: process.env, shell: false })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${command} ${args.join(' ')} exited with ${code}`))
    })
  })
}

ensureDatabaseUrl()
ensureJwtSecrets()
writePrismaEnv()

await run('npm', ['run', 'db:deploy', '-w', 'healthcart-backend'])
await run('npm', ['run', 'start:prod', '-w', 'healthcart-backend'])
