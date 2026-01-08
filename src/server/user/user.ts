import { db } from "@/server/db";

import type { User } from "@/types/users";

const env = process.env

export interface UserData {
  name?: string;
  displayName?: string;
  handle?: string;
  bio?: string;
  email?: string;
  image?: string;
  xp?: number;
}

export interface UserUpdateData {
  name?: string;
  displayName?: string;
  handle?: string;
  bio?: string;
  image?: string;
  xp?: number;
}

export class Users {
  static async add(data: UserData) {
    try {
      const newUser = await db.user.create({
        data,
      });
      return newUser;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "There was an issue creating this user";
      throw new Error(errorMessage);
    }
  }

  static async all(): Promise<User[]> {
    try {
      const users = await db.user.findMany();
      return users;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "There was an issue fetching users";
      throw new Error(errorMessage);
    }
  }

  static async delete(id: string) {
    try {
      const deletedUser = await db.user.delete({
        where: { id },
      });
      return deletedUser;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "There was an issue deleting this user";
      throw new Error(errorMessage);
    }
  }

  static async edit(id: string, data: UserUpdateData) {
    try {
      const disallowedKeys = [
        "id",
        "email",
        "emailVerified",
        "verified",
        "moderator",
        "createdAt",
      ];

      for (const key of disallowedKeys) {
        if (key in data) {
          throw new Error(`Cannot modify protected field: ${key}`);
        }
      }

      const updatedUser = await db.user.update({
        where: { id },
        data,
      });

      return updatedUser;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "There was an issue updating this user";
      throw new Error(errorMessage);
    }
  }

  static async isHandleReserved(handle: string) {
    let reservedHandles: string[] = [];
    if (env.RESERVED_USERNAMES) {
      try {
        reservedHandles = JSON.parse(env.RESERVED_USERNAMES).map((h: string) => h.trim().toLowerCase());
      } catch {
        reservedHandles = env.RESERVED_USERNAMES.split(",").map((h) => h.trim().toLowerCase());
      }
    }
    return reservedHandles.includes(handle.toLowerCase());
  }

  static async isHandleTaken(handle: string, excludeUserId?: string) {
    const user = await db.user.findUnique({
      where: { handle: handle.toLowerCase() },
    });
    if (!user) return false;
    if (excludeUserId && user.id === excludeUserId) return false;
    return true;
  }

  static async verify(userId: string) {
    try {
      return await db.user.update({
        where: { id: userId },
        data: { verified: true },
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Could not verify user";
      throw new Error(errorMessage);
    }
  }

  static async unverify(userId: string) {
    try {
      return await db.user.update({
        where: { id: userId },
        data: { verified: false },
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Could not unverify user";
      throw new Error(errorMessage);
    }
  }

  static async mod(userId: string) {
    try {
      return await db.user.update({
        where: { id: userId },
        data: { moderator: true },
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Could not give moderator rights";
      throw new Error(errorMessage);
    }
  }

  static async unMod(userId: string) {
    try {
      return await db.user.update({
        where: { id: userId },
        data: { moderator: false },
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Could not remove moderator rights";
      throw new Error(errorMessage);
    }
  }

  static async get(userId: string) {
    try {
      const user = await db.user.findUnique({
        where: { id: userId },
        include: {
          reviews: {
            include: {
              bubbler: true,
            },
          },
          bubblers: true,
          accounts: true,
          sessions: true,
        },
      });
      if (!user) throw new Error("User not found");
      return user;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "There was an issue fetching this user";
      throw new Error(errorMessage);
    }
  }

  static async getByEmail(email: string) {
    try {
      const user = await db.user.findUnique({
        where: { email },
      });
      return user;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "There was an issue fetching this user";
      throw new Error(errorMessage);
    }
  }

  static async removeBio(id: string) {
    try {
      const updatedUser = await db.user.update({
        where: { id },
        data: { bio: '[ Content Deleted ]' },
      });
      return updatedUser;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "There was an issue removing the bio";
      throw new Error(errorMessage);
    }
  }

  static async removeImage(id: string) {
    try {
      const updatedUser = await db.user.update({
        where: { id },
        data: { image: '[ Content Deleted ]' },
      });
      return updatedUser;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "There was an issue removing the image";
      throw new Error(errorMessage);
    }
  }

  static async removeHandle(id: string) {
    try {
      let newHandle: string;
      let exists = true;

      while (exists) {
        const randomNum = Math.floor(Math.random() * 1_000_000_000);
        newHandle = `[ Content Deleted ${randomNum} ]`;

        const existingUser = await db.user.findUnique({
          where: { handle: newHandle },
        });

        exists = !!existingUser;
      }

      const updatedUser = await db.user.update({
        where: { id },
        data: { handle: newHandle! },
      });

      return updatedUser;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "There was an issue removing the handle";
      throw new Error(errorMessage);
    }
  }

  static async getUserByUsername(handle: string) {
    return db.user.findUnique({
      where: { handle },
    });
  }

  static async getUserContributions(userId: string) {
    try {
      const [bubblers, reviews, logs, totalBubblers, totalReviews, totalEdits] = await Promise.all([
        db.bubbler.findMany({
          where: { addedByUserId: userId },
          orderBy: { createdAt: 'desc' },
          take: 10,
        }),
        db.review.findMany({
          where: { userId },
          include: {
            bubbler: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        }),
        db.bubblerLog.findMany({
          where: { userId },
          include: {
            bubbler: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        }),
        db.bubbler.count({ where: { addedByUserId: userId } }),
        db.review.count({ where: { userId } }),
        db.bubblerLog.count({ where: { userId, action: 'UPDATE' } }),
      ]);

      return {
        bubblers,
        reviews,
        logs,
        totalBubblers,
        totalReviews,
        totalEdits,
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "There was an issue fetching user contributions";
      throw new Error(errorMessage);
    }
  }
}
