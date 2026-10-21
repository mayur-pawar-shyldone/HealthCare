import { spawn } from 'node:child_process'

function mysqlUrlFromParts() {
  const user = process.env.MYSQLUSER || process.env.MYSQL_USER
  const password = process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD || ''
  const host = process.env.MYSQLHOST || process.env.MYSQL_HOST
  const port = process.env.MYSQLPORT || process.env.MYSQL_PORT || '3306'
  const database = process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE
  if (!user || !host || !database) return null
  const auth = `${encodeURIComponent(user)}:${encodeURIComponent(password)}`
  return `mysql://${auth}@${host}:${port}/${database}`
}

function ensureDatabaseUrl() {
  if (process.env.DATABASE_URL) return
  const fromPlugin = process.env.MYSQL_URL || process.env.MYSQL_PRIVATE_URL || process.env.MYSQL_PUBLIC_URL
  process.env.DATABASE_URL = fromPlugin || mysqlUrlFromParts() || ''
  if (process.env.DATABASE_URL) return

  console.error(`
DATABASE_URL is not set, so Prisma cannot start.

In Railway:
1. Create → Database → MySQL (in the same project)
2. Open this app service → Variables
3. Add DATABASE_URL from the MySQL service, for example:
   DATABASE_URL=\${{ MySQL.MYSQL_URL }}
4. Also set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET
5. Redeploy
`)
  process.exit(1)
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

await run('npm', ['run', 'db:deploy', '-w', 'healthcart-backend'])
await run('npm', ['run', 'start:prod', '-w', 'healthcart-backend'])
