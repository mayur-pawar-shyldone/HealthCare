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
      /^(DATABASE|MYSQL|MARIA|POSTGRES|PG|DB_|JWT_|RAILWAY_)/i.test(key),
    )
    .sort()
}

function ensureDatabaseUrl() {
  const existing = firstEnv(
    'DATABASE_URL',
    'MYSQL_URL',
    'MYSQL_PRIVATE_URL',
    'MYSQL_DATABASE_URL',
    'MYSQL_PUBLIC_URL',
  )
  process.env.DATABASE_URL = existing || mysqlUrlFromParts()
  if (process.env.DATABASE_URL) return

  const service = process.env.RAILWAY_SERVICE_NAME || 'this app service'
  const keys = relatedEnvKeys()
  console.error(`
DATABASE_URL is not set on ${service}.
This is a Railway project setting, not an app bug.

On the Railway canvas:
1. Click + New → Database → MySQL
2. Wait until the MySQL card is Running
3. Click THIS app service (the one printing this log), then Variables
4. New Variable:
     DATABASE_URL = \${{MySQL.MYSQL_URL}}
   Use the exact MySQL card name if it is not "MySQL"
5. Save. Railway will redeploy by itself.

Do not paste a localhost URL. Do not add this in GitHub secrets.

Env keys visible here: ${keys.length ? keys.join(', ') : '(none — MySQL is not attached to this service)'}
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
