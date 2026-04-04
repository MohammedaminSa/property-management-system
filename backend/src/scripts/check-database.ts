const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Checking database schema...');
  
  try {
    // Test if we can query properties
    const testProperty = await prisma.property.findFirst();
    console.log('✅ Database connection working');
    console.log('Test property:', testProperty ? 'Found' : 'None');
    
    // Check if required columns exist
    const requiredRelations = [
      'about',
      'images', 
      'reviews',
      'location',
      'contact',
      'facilities',
      'rooms'
    ];
    
    for (const relation of requiredRelations) {
      try {
        await prisma.property.findFirst({
          include: { [relation]: true }
        });
        console.log(`✅ Relation "${relation}" exists`);
      } catch (e) {
        console.error(`❌ Relation "${relation}" missing:`, e.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
