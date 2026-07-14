import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, role, companyName, contactPhone, category, metadata, password } = body;

    if (!email || !role || !companyName) {
      return NextResponse.json(
        { message: "Missing required fields: email, role, and company name." },
        { status: 400 }
      );
    }

    // Security check: Block direct public registration as ADMIN
    if (role === "ADMIN") {
      return NextResponse.json(
        { message: "Registration of administrator accounts is restricted." },
        { status: 403 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 409 }
      );
    }

    // Create user and profile in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        role,
        passwordHash: password || "12345678",
        profile: {
          create: {
            companyName,
            contactPhone: contactPhone || null,
            category: category || null,
            verified: role === "ADMIN" ? true : false, // Admins auto-verified
            metadata: metadata || null
          }
        }
      },
      include: {
        profile: true
      }
    });

    return NextResponse.json(
      {
        message: "User registered successfully.",
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          profile: newUser.profile
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}
