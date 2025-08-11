const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function cleanupBase64Images() {
  try {
    console.log('🔍 Searching for users with base64 image data...')
    
    // Find all users with base64 image data
    const usersWithBase64 = await prisma.user.findMany({
      where: {
        image: {
          startsWith: 'data:'
        }
      },
      select: {
        id: true,
        email: true,
        image: true
      }
    })
    
    if (usersWithBase64.length === 0) {
      console.log('✅ No users with base64 image data found')
      return
    }
    
    console.log(`📸 Found ${usersWithBase64.length} users with base64 image data`)
    
    // Clear the base64 data
    for (const user of usersWithBase64) {
      console.log(`🧹 Cleaning up image data for user: ${user.email}`)
      
      await prisma.user.update({
        where: { id: user.id },
        data: { image: null }
      })
    }
    
    console.log('✅ Successfully cleaned up all base64 image data')
    
  } catch (error) {
    console.error('❌ Error cleaning up base64 images:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the cleanup
cleanupBase64Images()
