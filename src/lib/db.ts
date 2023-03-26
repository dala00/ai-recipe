import { Prisma, PrismaClient } from '@prisma/client'

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

function getLogLevel(): (Prisma.LogLevel | Prisma.LogDefinition)[] {
  if (process.env.NODE_ENV === 'test') {
    return []
  }

  if (process.env.NODE_ENV === 'production') {
    return ['info', 'warn', 'error']
  }

  return ['query', 'info', 'warn', 'error']
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: getLogLevel(),
  })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
