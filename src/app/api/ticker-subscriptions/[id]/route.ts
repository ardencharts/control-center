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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const prisma = await getPrismaClient();
    const { id } = await params;
    const parsedId = parseInt(id);
    const data = await request.json();

    const item = await prisma.tickerSubscription.update({
      where: { id: parsedId },
      data: {
        symbol: data.symbol,
        enabled: data.enabled,
        marketSymbol: data.marketSymbol,
        exchange: data.exchange,
        type: data.type,
        description: data.description,
        name: data.name,
        base: data.base,
        quote: data.quote,
        tradable: data.tradable,
        subType: data.subType,
        change: data.change,
        changePercent: data.changePercent,
        last: data.last,
        volume: data.volume,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(item);
  } catch (error: any) {
    console.error("Error updating ticker subscription:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Ticker subscription not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update ticker subscription" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const prisma = await getPrismaClient();
    const { id } = await params;
    const parsedId = parseInt(id);
    await prisma.tickerSubscription.delete({
      where: { id: parsedId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting ticker subscription:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Ticker subscription not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete ticker subscription" },
      { status: 500 }
    );
  }
}

