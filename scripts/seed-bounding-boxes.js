// Script to seed the database with initial bounding boxes
// Run with: node scripts/seed-bounding-boxes.js

import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding bounding boxes...');

  // Example: Unreliable area bounding box
  const unreliableArea = await prisma.boundingBox.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Under Maintenance',
      description: 'This area is currently under maintenance. Information may be unreliable.',
      color: '#ff8c00',
      coordinates: [
        [
          [152.95, -27.45],
          [153.05, -27.45],
          [153.05, -27.55],
          [152.95, -27.55],
          [152.95, -27.45]
        ]
      ],
      properties: {
        type: 'maintenance',
        unreliable: true,
        priority: 'high'
      },
      active: true
    }
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });