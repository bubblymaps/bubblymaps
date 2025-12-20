'use server';

import { db } from '@/server/db';
import { auth } from '@/server/auth';
import { env } from '@/env';
import { revalidatePath } from 'next/cache';

async function checkMod() {
  const session = await auth();
  if (!session?.user?.moderator) {
    throw new Error('Unauthorized');
  }
  return session.user;
}

async function logToDiscord(action: string, details: string, user: any) {
  if (!env.DISCORD_WEBHOOK_URL) return;

  try {
    await fetch(env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: `Mod Action: ${action}`,
          description: details,
          color: 0x3b82f6,
          fields: [
            { name: 'Moderator', value: `${user.name || user.email} (${user.email})`, inline: true },
            { name: 'Time', value: new Date().toISOString(), inline: true },
          ],
        }],
      }),
    });
  } catch (e) {
    console.error('Failed to log to Discord', e);
  }
}

function getDiff(oldData: any, newData: any) {
  const changes: string[] = [];
  for (const key in newData) {
    if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
      changes.push(`${key}: ${JSON.stringify(oldData[key])} -> ${JSON.stringify(newData[key])}`);
    }
  }
  return changes.join('\n');
}

// Bubblers
export async function getBubblers(page = 1, pageSize = 20, search = '') {
  await checkMod();
  const skip = (page - 1) * pageSize;
  const where = search ? {
    OR: [
      { name: { contains: search, mode: 'insensitive' as const } },
      { description: { contains: search, mode: 'insensitive' as const } },
      { region: { contains: search, mode: 'insensitive' as const } },
    ]
  } : {};

  const [data, total] = await Promise.all([
    db.bubbler.findMany({ 
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize
    }),
    db.bubbler.count({ where })
  ]);
  
  return {
    data,
    metadata: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  };
}

export async function updateBubbler(id: number, data: any) {
  const user = await checkMod();
  const oldData = await db.bubbler.findUnique({ where: { id } });
  
  // Remove id and other immutable fields if present
  const { id: _, createdAt, updatedAt, addedBy, reviews, BubblerLog, ...updateData } = data;
  
  const result = await db.bubbler.update({ where: { id }, data: updateData });
  
  await db.bubblerLog.create({
    data: {
      bubblerId: id,
      userId: user.id,
      action: 'update',
      oldData: oldData as any,
      newData: result as any
    }
  });

  const diff = getDiff(oldData, result);
  await logToDiscord('Update Bubbler', `Updated bubbler ${id} (${result.name})\nChanges:\n${diff}`, user);
  
  revalidatePath('/mod');
  return result;
}

export async function deleteBubbler(id: number) {
  const user = await checkMod();
  const result = await db.bubbler.delete({ where: { id } });
  await logToDiscord('Delete Bubbler', `Deleted bubbler ${id} (${result.name})`, user);
  revalidatePath('/mod');
  return result;
}

export async function createBubbler(data: any) {
  const user = await checkMod();
  const result = await db.bubbler.create({ 
    data: { 
      ...data, 
      addedByUserId: data.addedByUserId || user.id,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude)
    } 
  });

  await db.bubblerLog.create({
    data: {
      bubblerId: result.id,
      userId: user.id,
      action: 'create',
      newData: result as any
    }
  });

  await logToDiscord('Create Bubbler', `Created bubbler ${result.id} (${result.name})`, user);
  revalidatePath('/mod');
  return result;
}

// Users
export async function getUsers(search = '') {
  await checkMod();
  const where = search ? {
    OR: [
      { name: { contains: search, mode: 'insensitive' as const } },
      { email: { contains: search, mode: 'insensitive' as const } },
      { handle: { contains: search, mode: 'insensitive' as const } },
      { id: { contains: search, mode: 'insensitive' as const } },
    ]
  } : {};
  return db.user.findMany({ where, orderBy: { createdAt: 'desc' } });
}

export async function createUser(data: any) {
  const user = await checkMod();
  const result = await db.user.create({ data });
  await logToDiscord('Create User', `Created user ${result.id} (${result.email})`, user);
  revalidatePath('/mod');
  return result;
}

export async function updateUser(id: string, data: any) {
  const user = await checkMod();
  const oldData = await db.user.findUnique({ where: { id } });

  const { createdAt, updatedAt, accounts, sessions, reviews, bubblers, ReportAbuse, BubblerLog, ...updateData } = data;
  
  // If ID is being updated, we need to handle it carefully. 
  // Prisma update allows changing ID if no constraints prevent it.
  const result = await db.user.update({ where: { id }, data: updateData });
  
  const diff = getDiff(oldData, result);
  await logToDiscord('Update User', `Updated user ${id} (${result.email})\nChanges:\n${diff}`, user);
  
  revalidatePath('/mod');
  return result;
}

export async function deleteUser(id: string) {
  const user = await checkMod();
  const result = await db.user.delete({ where: { id } });
  await logToDiscord('Delete User', `Deleted user ${id} (${result.email})`, user);
  revalidatePath('/mod');
  return result;
}

// Reviews
export async function getReviews(search = '') {
  await checkMod();
  const where = search ? {
    OR: [
      { comment: { contains: search, mode: 'insensitive' as const } },
      { user: { name: { contains: search, mode: 'insensitive' as const } } },
      { bubbler: { name: { contains: search, mode: 'insensitive' as const } } },
    ]
  } : {};
  return db.review.findMany({ 
    where,
    include: { user: true, bubbler: true },
    orderBy: { createdAt: 'desc' } 
  });
}

export async function deleteReview(id: number) {
  const user = await checkMod();
  const result = await db.review.delete({ where: { id } });
  await logToDiscord('Delete Review', `Deleted review ${id}`, user);
  revalidatePath('/mod');
  return result;
}

// Reports
export async function getReports(search = '') {
  await checkMod();
  const where = search ? {
    OR: [
      { reason: { contains: search, mode: 'insensitive' as const } },
      { reporter: { name: { contains: search, mode: 'insensitive' as const } } },
    ]
  } : {};
  return db.reportAbuse.findMany({ 
    where,
    include: { reporter: true },
    orderBy: { createdAt: 'desc' } 
  });
}

export async function resolveReport(id: number) {
  const user = await checkMod();
  const result = await db.reportAbuse.update({ where: { id }, data: { resolved: true } });
  await logToDiscord('Resolve Report', `Resolved report ${id}`, user);
  revalidatePath('/mod');
  return result;
}

// Stats & Logs
export async function getStats() {
  await checkMod();
  const [bubblers, users, reviews, reports, pendingReports] = await Promise.all([
    db.bubbler.count(),
    db.user.count(),
    db.review.count(),
    db.reportAbuse.count(),
    db.reportAbuse.count({ where: { resolved: false } })
  ]);
  
  return {
    bubblers,
    users,
    reviews,
    reports,
    pendingReports
  };
}

export async function getRecentLogs() {
  await checkMod();
  return db.bubblerLog.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      bubbler: { select: { name: true } }
    }
  });
}

export async function getRecentContributions() {
  await checkMod();
  return db.bubblerLog.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { 
      user: { select: { name: true, email: true } },
      bubbler: { select: { name: true } }
    }
  });
}

export async function getLogs(page = 1, pageSize = 20, search = '') {
  await checkMod();
  const skip = (page - 1) * pageSize;
  const where = search ? {
    OR: [
      { action: { contains: search, mode: 'insensitive' as const } },
      { user: { name: { contains: search, mode: 'insensitive' as const } } },
      { bubbler: { name: { contains: search, mode: 'insensitive' as const } } },
    ]
  } : {};

  const [data, total] = await Promise.all([
    db.bubblerLog.findMany({ 
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        bubbler: { select: { name: true } }
      },
      skip,
      take: pageSize
    }),
    db.bubblerLog.count({ where })
  ]);
  
  return {
    data,
    metadata: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  };
}
