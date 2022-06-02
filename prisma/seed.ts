import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    await prisma.$connect

    await prisma.tag.deleteMany({})

    await prisma.tag.createMany({
        data: [
            {
                tag: 'SPRING',
            },
            {
                tag: 'SUMMER',
            },
            {
                tag: 'AUTHUM',
            },
            {
                tag: 'WINTER',
            },
        ],
    })
    // await prisma.post.deleteMany({})
    // await prisma.profile.deleteMany({})
    // await prisma.user.deleteMany({})
}

main()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
