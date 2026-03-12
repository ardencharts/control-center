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
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    
    // Per-field filters
    const filterEnabled = searchParams.get("filterEnabled") || "";
    const filterSymbol = searchParams.get("filterSymbol") || "";
    const filterMarketSymbol = searchParams.get("filterMarketSymbol") || "";
    const filterExchange = searchParams.get("filterExchange") || "";
    const filterType = searchParams.get("filterType") || "";
    const filterDescription = searchParams.get("filterDescription") || "";
    const filterName = searchParams.get("filterName") || "";
    const filterBase = searchParams.get("filterBase") || "";
    const filterQuote = searchParams.get("filterQuote") || "";
    const filterTradable = searchParams.get("filterTradable") || "";
    
    // Sorting
    const sortBy = searchParams.get("sortBy") || null;
    const sortOrder = (searchParams.get("sortOrder") || "asc") as "asc" | "desc";
    
    const skip = (page - 1) * limit;

    // Build where clause
    const whereConditions: any[] = [];

    // Search across multiple fields (OR)
    if (search) {
      whereConditions.push({
        OR: [
          { symbol: { contains: search, mode: "insensitive" as const } },
          { name: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ],
      });
    }

    // Per-field filters (AND)
    if (filterEnabled) {
      const enabledValue = filterEnabled.toLowerCase() === "yes" || filterEnabled.toLowerCase() === "true";
      whereConditions.push({ enabled: enabledValue });
    }
    if (filterSymbol) {
      whereConditions.push({
        symbol: { contains: filterSymbol, mode: "insensitive" as const },
      });
    }
    if (filterMarketSymbol) {
      whereConditions.push({
        marketSymbol: { contains: filterMarketSymbol, mode: "insensitive" as const },
      });
    }
    if (filterName) {
      whereConditions.push({
        name: { contains: filterName, mode: "insensitive" as const },
      });
    }
    if (filterExchange) {
      whereConditions.push({
        exchange: { contains: filterExchange, mode: "insensitive" as const },
      });
    }
    if (filterType) {
      whereConditions.push({
        type: { contains: filterType, mode: "insensitive" as const },
      });
    }
    if (filterDescription) {
      whereConditions.push({
        description: { contains: filterDescription, mode: "insensitive" as const },
      });
    }
    if (filterBase) {
      whereConditions.push({
        base: { contains: filterBase, mode: "insensitive" as const },
      });
    }
    if (filterQuote) {
      whereConditions.push({
        quote: { contains: filterQuote, mode: "insensitive" as const },
      });
    }
    if (filterTradable) {
      const tradableValue = filterTradable.toLowerCase() === "yes" || filterTradable.toLowerCase() === "true";
      whereConditions.push({ tradable: tradableValue });
    }

    const where =
      whereConditions.length > 0
        ? { AND: whereConditions }
        : {};

    // Build orderBy clause
    const orderBy = sortBy
      ? { [sortBy]: sortOrder }
      : { createdAt: "desc" as const };

    const [items, total] = await Promise.all([
      prisma.tickerSubscription.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      prisma.tickerSubscription.count({ where }),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching ticker subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch ticker subscriptions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const prisma = await getPrismaClient();
    const data = await request.json();
    const item = await prisma.tickerSubscription.create({
      data: {
        key: data.key || `${data.symbol}-${Date.now()}`,
        symbol: data.symbol || "NA",
        enabled: data.enabled ?? true,
        marketSymbol: data.marketSymbol || "NA",
        exchange: data.exchange || "NA",
        type: data.type || "NA",
        description: data.description || "NA",
        name: data.name || "NA",
        base: data.base || "NA",
        quote: data.quote || "NA",
        tradable: data.tradable ?? true,
        subType: data.subType || "",
        change: data.change || null,
        changePercent: data.changePercent || null,
        last: data.last || null,
        volume: data.volume || null,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    console.error("Error creating ticker subscription:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Ticker subscription key already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create ticker subscription" },
      { status: 500 }
    );
  }
}
