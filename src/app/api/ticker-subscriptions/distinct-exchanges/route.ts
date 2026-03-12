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

    const exchanges = await prisma.tickerSubscription.findMany({
      distinct: ["exchange"],
      select: { exchange: true },
      orderBy: { exchange: "asc" },
    });

    const distinctExchanges = exchanges
      .map((item: any) => item.exchange)
      .filter((exchange: string) => exchange && exchange.trim() !== "");

    return NextResponse.json({
      exchanges: distinctExchanges,
    });
  } catch (error) {
    console.error("Error fetching distinct exchanges:", error);
    return NextResponse.json(
      { error: "Failed to fetch distinct exchanges" },
      { status: 500 }
    );
  }
}
