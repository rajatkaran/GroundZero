import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, email, role } = body;

    if (!id || !email || !role) {
      return NextResponse.json({ valid: false, message: "Missing session info." }, { status: 400 });
    }

    // 1. First look up user by ID
    const userById = await prisma.user.findUnique({
      where: { id },
      include: { profile: true }
    });

    if (userById && userById.role === role && userById.email === email) {
      return NextResponse.json({
        valid: true,
        refreshed: false,
        user: {
          id: userById.id,
          email: userById.email,
          role: userById.role,
          profile: userById.profile
        }
      });
    }

    // 2. If ID mismatch (e.g. database re-seeded), look up by email
    const userByEmail = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (userByEmail && userByEmail.role === role) {
      // Return refreshed session details with the new UUID
      return NextResponse.json({
        valid: true,
        refreshed: true,
        user: {
          id: userByEmail.id,
          email: userByEmail.email,
          role: userByEmail.role,
          profile: userByEmail.profile
        }
      });
    }

    // 3. User is invalid or role mismatch
    return NextResponse.json({ valid: false, message: "Session expired or invalid." }, { status: 200 });

  } catch (error: any) {
    console.error("Session verification error:", error);
    return NextResponse.json({ valid: false, message: "Verification error." }, { status: 500 });
  }
}
