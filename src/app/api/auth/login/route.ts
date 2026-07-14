import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkAndSeedDatabase } from "@/lib/seed";

export async function POST(req: NextRequest) {
  try {
    // Ensure database contains pre-seeded accounts
    await checkAndSeedDatabase();

    const body = await req.json();
    const { email, role, password, otp } = body;

    if (!email || !role) {
      return NextResponse.json(
        { message: "Missing email or role." },
        { status: 400 }
      );
    }

    // Lookup user in DB
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found. Please register first." },
        { status: 404 }
      );
    }

    // Role check to prevent login spoofing
    if (user.role !== role) {
      return NextResponse.json(
        { message: `Invalid login path. Your account is registered as a ${user.role}.` },
        { status: 403 }
      );
    }

    // Verify authentication credentials (password or simulated OTP)
    if (otp) {
      if (otp !== "123456") {
        return NextResponse.json(
          { message: "Invalid OTP. Enter 123456 to bypass during testing." },
          { status: 401 }
        );
      }
    } else if (password) {
      const isPasswordMatch = user.passwordHash === password;
      if (!isPasswordMatch) {
        return NextResponse.json(
          { message: "Incorrect password. Default testing password for seeded accounts is 12345678." },
          { status: 401 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "Authentication required. Please enter a password or OTP." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Login successful.",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: user.profile
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}
