#!/usr/bin/env node

import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient();

async function main() {
  console.log('Fetching bubblers...');
  const bubblers = await prisma.bubbler.findMany({ select: { id: true, addedByUserId: true, createdAt: true, name: true } });

  let createdCount = 0;

  for (const b of bubblers) {
    const hasCreate = await prisma.bubblerLog.findFirst({ where: { bubblerId: b.id, action: 'CREATE' } });
    if (!hasCreate) {
      await prisma.bubblerLog.create({
        data: {
          bubblerId: b.id,
          userId: b.addedByUserId ?? null,
          action: 'CREATE',
          oldData: { equals: null },
          newData: {
            id: b.id,
            name: b.name,
            createdAt: b.createdAt,
          },
          createdAt: b.createdAt,
        },
      });
      createdCount++;
    }
  }

  console.log(`Backfill complete. Created ${createdCount} missing CREATE logs.`);
}

main()
  .catch((e) => {
    console.error('Error during backfill:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
