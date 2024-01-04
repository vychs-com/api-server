import PrismaClient_pkg from '@prisma/client'
const { PrismaClient } = PrismaClient_pkg

let prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma
}

prisma.$on('beforeExit', () => console.log('Shutting down Prisma server...'))

export default prisma
