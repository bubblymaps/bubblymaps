import { db } from "@/server/db";

import type { User } from "@/types/users";

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
      const [bubblers, reviews, logs] = await Promise.all([
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
      ]);

      return {
        bubblers,
        reviews,
        logs,
        totalBubblers: bubblers.length,
        totalReviews: reviews.length,
        totalEdits: logs.filter(log => log.action === 'update').length,
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "There was an issue fetching user contributions";
      throw new Error(errorMessage);
    }
  }
}
