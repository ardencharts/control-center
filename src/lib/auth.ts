"use server";

import bcrypt from "bcryptjs";

let prismaClient: any = null;

async function getPrismaClient() {
  if (!prismaClient) {
    const { PrismaClient } = await import("../generated/prisma/client");
    prismaClient = new PrismaClient();
  }
  return prismaClient;
}

// Initialize default user on module load
let initialized = false;

async function initializeDefaultUser() {
  if (initialized) return;
  initialized = true;

  try {
    const prisma = await getPrismaClient();
    const existingUser = await prisma.user.findUnique({
      where: { username: "admin" },
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash("admin", 10);
      await prisma.user.create({
        data: {
          username: "admin",
          password: hashedPassword,
        },
      });
      console.log("Default admin user created");
    }
  } catch (error) {
    console.error("Error initializing default user:", error);
  }
}

// Call initialization
initializeDefaultUser().catch(console.error);

export async function verifyCredentials(
  username: string,
  password: string
): Promise<boolean> {
  try {
    const prisma = await getPrismaClient();
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return false;

    return await bcrypt.compare(password, user.password);
  } catch (error) {
    console.error("Error verifying credentials:", error);
    return false;
  }
}

export async function getUserByUsername(username: string) {
  try {
    const prisma = await getPrismaClient();
    return await prisma.user.findUnique({
      where: { username },
      select: { id: true, username: true },
    });
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

export async function changePassword(
  username: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const isValidCurrent = await verifyCredentials(username, currentPassword);
    if (!isValidCurrent) {
      return { success: false, error: "Current password is incorrect" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const prisma = await getPrismaClient();
    
    await prisma.user.update({
      where: { username },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    console.error("Error changing password:", error);
    return { success: false, error: "Failed to change password" };
  }
}
