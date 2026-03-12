"use server";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("session");

    if (!sessionCookie) {
      return NextResponse.json({ loggedIn: false }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);

    return NextResponse.json({ loggedIn: session.loggedIn, username: session.username });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json({ loggedIn: false }, { status: 401 });
  }
}
