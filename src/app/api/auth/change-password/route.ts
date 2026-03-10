"use server";

import { NextRequest, NextResponse } from "next/server";
import { changePassword } from "@/lib/auth";

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

function getUsername(request: NextRequest): string | null {
  const sessionCookie = request.cookies.get("session");
  if (!sessionCookie) return null;

  try {
    const session = JSON.parse(sessionCookie.value);
    return session.username || null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const username = getUsername(request);
    if (!username) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword, confirmPassword } =
      await request.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "New passwords do not match" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const result = await changePassword(username, currentPassword, newPassword);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
