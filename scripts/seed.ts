import 'dotenv/config'
import { neon } from '@neondatabase/serverless'
import { hashPassword } from 'better-auth/crypto'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/neon-http'

import * as schema from '../src/server/db/schema'
import { accounts, buckets, categories, todos, users } from '../src/server/db/schema'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to seed the database.')
}

const db = drizzle(neon(databaseUrl), { schema })

const primaryUserEmail = 'aaa@aaa.aaa'
const seedUsers = [
  {
    email: primaryUserEmail,
    id: 'seed-user-aaa',
    name: 'AAA Seed',
    password: 'aaa@aaa.aaa',
  },
  {
    email: 'bbb@bbb.bbb',
    id: 'seed-user-bbb',
    name: 'BBB Seed',
    password: 'bbb@bbb.bbb',
  },
] as const

async function main() {
  const now = new Date()
  const shouldReset = !process.argv.includes('--skip-reset')

  if (shouldReset) {
    await resetDatabase()
  }

  await seedAuthUsers(now)
  const seedBuckets = await seedPrimaryUserBuckets(now)
  const seedCategories = await seedPrimaryUserCategories()
  await seedPrimaryUserTodos(seedBuckets, seedCategories, now)

  console.log(
    [
      'Seed completed.',
      `Users: ${seedUsers.map((user) => `${user.email} / ${user.password}`).join(', ')}`,
      `Buckets: ${seedBuckets.length}`,
      `Categories: ${seedCategories.length}`,
      'Todos: 25',
      shouldReset ? 'Database was reset before seeding.' : 'Database reset was skipped.',
    ].join('\n'),
  )
}

async function resetDatabase() {
  await db.execute(
    sql`truncate table "todos", "categories", "buckets", "accounts", "sessions", "verifications", "users" restart identity cascade`,
  )
}

async function seedAuthUsers(now: Date) {
  await db.insert(users).values(
    seedUsers.map((user) => ({
      createdAt: now,
      email: user.email,
      emailVerified: true,
      id: user.id,
      name: user.name,
      updatedAt: now,
    })),
  )

  await db.insert(accounts).values(
    await Promise.all(
      seedUsers.map(async (user) => ({
        accountId: user.id,
        createdAt: now,
        id: `seed-account-${user.id}`,
        password: await hashPassword(user.password),
        providerId: 'credential',
        updatedAt: now,
        userId: user.id,
      })),
    ),
  )
}

async function seedPrimaryUserBuckets(now: Date) {
  const periods = getCurrentPeriods(now)

  return db
    .insert(buckets)
    .values([
      {
        period: 'inbox',
        status: 'active',
        type: 'inbox',
        userId: 'seed-user-aaa',
      },
      {
        period: periods.year,
        status: 'active',
        type: 'yearly',
        userId: 'seed-user-aaa',
      },
      {
        period: periods.month,
        status: 'active',
        type: 'monthly',
        userId: 'seed-user-aaa',
      },
      {
        period: periods.week,
        status: 'active',
        type: 'weekly',
        userId: 'seed-user-aaa',
      },
      {
        period: periods.day,
        status: 'active',
        type: 'daily',
        userId: 'seed-user-aaa',
      },
    ])
    .returning()
}

async function seedPrimaryUserCategories() {
  return db
    .insert(categories)
    .values([
      {
        colorKey: 'blue',
        name: 'work',
        userId: 'seed-user-aaa',
      },
      {
        colorKey: 'green',
        name: 'home admin',
        userId: 'seed-user-aaa',
      },
      {
        colorKey: 'amber',
        name: 'personal',
        userId: 'seed-user-aaa',
      },
      {
        colorKey: 'rose',
        name: 'health',
        userId: 'seed-user-aaa',
      },
    ])
    .returning()
}

async function seedPrimaryUserTodos(
  seedBuckets: Array<typeof buckets.$inferSelect>,
  seedCategories: Array<typeof categories.$inferSelect>,
  now: Date,
) {
  await db.insert(todos).values(
    Array.from({ length: 25 }, (_, index) => {
      const todoIndex = index + 1
      const bucket = seedBuckets[index % seedBuckets.length]
      const category = todoIndex <= 5 ? seedCategories[index % seedCategories.length] : undefined

      return {
        bucketId: bucket.id,
        categoryId: category?.id ?? null,
        completed: false,
        createdAt: new Date(now.getTime() + todoIndex * 1000),
        description: `Seed todo description ${String(todoIndex).padStart(2, '0')}`,
        title: `Seed Todo ${String(todoIndex).padStart(2, '0')}`,
        userId: 'seed-user-aaa',
      }
    }),
  )
}

function getCurrentPeriods(date: Date) {
  const year = date.getFullYear()
  const month = `${year}-${pad(date.getMonth() + 1)}`
  const day = `${month}-${pad(date.getDate())}`
  const { week, weekYear } = getIsoWeek(date)

  return {
    day,
    month,
    week: `${weekYear}-W${pad(week)}`,
    year: String(year),
  }
}

function getIsoWeek(date: Date) {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNumber = target.getUTCDay() || 7

  target.setUTCDate(target.getUTCDate() + 4 - dayNumber)

  const weekYear = target.getUTCFullYear()
  const yearStart = new Date(Date.UTC(weekYear, 0, 1))
  const week = Math.ceil(((target.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7)

  return { week, weekYear }
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}

main().catch((error: unknown) => {
  console.error('Seed failed.')
  console.error(error)
  process.exit(1)
})
