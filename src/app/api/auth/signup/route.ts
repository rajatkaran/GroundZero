import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { getOrganizerWelcomeEmail, getBrandWelcomeEmail, getVendorWelcomeEmail } from "@/lib/templates";
import { sendVendorWelcomeWhatsApp } from "@/lib/whatsapp";

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
        passwordHash: password || process.env.SEED_ADMIN_PASSWORD || "fallback_unsecure_pass",
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

    // Send Welcome Email asynchronously
    try {
      let emailHtml = "";
      let subject = "Welcome to Ground Zero!";
      
      if (role === "ORGANIZER") {
        emailHtml = getOrganizerWelcomeEmail(companyName);
        subject = "Ground Zero - Welcome to the Organizer Network!";
      } else if (role === "VENDOR") {
        if (category === "SPONSOR" || category === "SPONSORS" || category === "BRAND") {
          emailHtml = getBrandWelcomeEmail(companyName);
          subject = "Ground Zero - Drive Offline Acquisition at ₹1 CAC";
        } else {
          emailHtml = getVendorWelcomeEmail(companyName);
          subject = "Ground Zero - Start Booking Premium Stall Spaces";
        }
      }

      if (emailHtml) {
        // Send email (runs asynchronously in background, error caught locally)
        sendEmail({
          to: email,
          subject,
          html: emailHtml
        }).catch(err => {
          console.error("Async signup welcome email sending failed:", err);
        });
      }

      if (role === "VENDOR" && contactPhone) {
        sendVendorWelcomeWhatsApp(contactPhone, companyName).catch(err => {
          console.error("Async signup welcome WhatsApp sending failed:", err);
        });
      }
    } catch (emailError) {
      console.error("Signup email formatting/trigger failed:", emailError);
    }

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
