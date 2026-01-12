import {prisma} from './src/lib/prisma'

async function testPrismaV5() {
    console.log('🧪 Testing Prisma v5 Setup...\n')

    try {
        // Test 1: Connect
        console.log('1️⃣ Testing connection...')
        await prisma.$connect()
        console.log('   ✅ Connected successfully!')

        // Test 2: Query
        console.log('\n2️⃣ Testing query...')
        const userCount = await prisma.users.count()
        console.log(`   ✅ Found ${userCount} users in database`)

        // Test 3: Check students
        console.log('\n3️⃣ Testing students table...')
        const studentCount = await prisma.students.count()
        console.log(`   ✅ Found ${studentCount} students`)

        // Test 4: Check test tables
        console.log('\n4️⃣ Testing test tables...')
        const mbtiCount = await prisma.mbti_tests.count()
        const riasecCount = await prisma.riasec_tests.count()
        const gritCount = await prisma.grit_tests.count()
        console.log(`   ✅ MBTI tests: ${mbtiCount}`)
        console.log(`   ✅ RIASEC tests: ${riasecCount}`)
        console.log(`   ✅ GRIT tests: ${gritCount}`)

        // Disconnect
        await prisma.$disconnect()

        console.log('\n' + '═'.repeat(50))
        console.log('🎉 All tests passed! Prisma v5 is working correctly.')
        console.log('═'.repeat(50) + '\n')

    } catch (error) {
        console.error('\n❌ Test failed:', error)
        process.exit(1)
    }
}

testPrismaV5()

