import { prisma } from "../lib/prisma";

async function fixPropertyTypes() {
  console.log("🔍 Checking property types...\n");

  try {
    // Fetch all properties
    const properties = await prisma.property.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        accessType: true,
      },
    });

    console.log(`Found ${properties.length} properties\n`);

    let fixedCount = 0;
    const validTypes = ["HOTEL", "APARTMENT", "RESORT", "VILLA", "GUEST_HOUSE", "HOSTEL", "LODGE"];

    for (const property of properties) {
      console.log(`Property: ${property.name}`);
      console.log(`  Current type: ${property.type}`);
      console.log(`  Access type: ${property.accessType}`);

      // Check if type is valid
      if (!property.type || !validTypes.includes(property.type)) {
        console.log(`  ⚠️  Invalid type! Fixing to HOTEL...`);
        
        await prisma.property.update({
          where: { id: property.id },
          data: { type: "HOTEL" },
        });
        
        fixedCount++;
        console.log(`  ✅ Fixed!`);
      } else {
        console.log(`  ✅ Type is valid`);
      }
      console.log("");
    }

    console.log(`\n📊 Summary:`);
    console.log(`  Total properties: ${properties.length}`);
    console.log(`  Fixed properties: ${fixedCount}`);
    console.log(`  Valid properties: ${properties.length - fixedCount}`);

    // Show breakdown by type
    const breakdown = await prisma.property.groupBy({
      by: ["type"],
      _count: true,
    });

    console.log(`\n📈 Properties by type:`);
    breakdown.forEach((item) => {
      console.log(`  ${item.type}: ${item._count}`);
    });

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixPropertyTypes();
