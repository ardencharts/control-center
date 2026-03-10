"use server";

import { NextRequest, NextResponse } from "next/server";

let prismaClient: any = null;

async function getPrismaClient() {
  if (!prismaClient) {
    const { PrismaClient } = await import("@/generated/prisma/client");
    prismaClient = new PrismaClient();
  }
  return prismaClient;
}

function isAuthenticated(request: NextRequest): boolean {
  const sessionCookie = request.cookies.get("session");
  if (!sessionCookie) return false;

  try {
    const session = JSON.parse(sessionCookie.value);
    return session.loggedIn === true;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const prisma = await getPrismaClient();

    const subTypes = await prisma.tickerSubscription.findMany({
      distinct: ["subType"],
      select: { subType: true },
      orderBy: { subType: "asc" },
    });

    const distinctSubTypes = subTypes
      .map((item: any) => item.subType)
      .filter((subType: string) => subType && subType.trim() !== "");

    return NextResponse.json({
      subTypes: distinctSubTypes,
    });
  } catch (error) {
    console.error("Error fetching distinct subTypes:", error);
    return NextResponse.json(
      { error: "Failed to fetch distinct subTypes" },
      { status: 500 }
    );
  }
}
