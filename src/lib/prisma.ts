// src/lib/prisma.ts
import {PrismaClient} from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

function createPrismaClient() {
    try {
        const connectionString = process.env.DATABASE_URL

        if (!connectionString) {
            console.warn('⚠️ DATABASE_URL not found, using default configuration')
        }

        // Simple Prisma Client without adapter (more stable)
        return new PrismaClient({
            log: [], // Disable all Prisma logs (no query, no error, no warn)
            datasources: {
                db: {
                    url: connectionString || process.env.DATABASE_URL
                }
            }
        })
    } catch (error) {
        console.error('❌ Error creating Prisma Client:', error)
        // Return a basic client as fallback
        return new PrismaClient({
            log: [] // Disable all logs
        })
    }
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

// Cleanup on app shutdown
if (process.env.NODE_ENV !== 'production') {
    process.on('beforeExit', async () => {
        await prisma.$disconnect()
    })
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma