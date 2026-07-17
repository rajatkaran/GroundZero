import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { getOrganizerWelcomeEmail, getVendorWelcomeEmail } from "@/lib/templates";

export async function POST(req: NextRequest) {
  try {
    const { credential, role } = await req.json();

    if (!credential) {
      return NextResponse.json(
        { message: "Missing Google credential token." },
        { status: 400 }
      );
    }

    // Decode Google JWT payload server-side safely using standard base64 decoding
    const parts = credential.split(".");
    if (parts.length !== 3) {
      return NextResponse.json(
        { message: "Invalid Google credential format." },
        { status: 400 }
      );
    }

    const payloadJson = Buffer.from(parts[1], "base64").toString("utf-8");
    const payload = JSON.parse(payloadJson);
    const { email, name, picture } = payload;

    if (!email) {
      return NextResponse.json(
        { message: "Google authentication failed to supply email." },
        { status: 400 }
      );
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true
      }
    });

    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      const targetRole = role || "VENDOR";
      const companyName = name || email.split("@")[0];

      // Auto-register new Google user in database
      user = await prisma.user.create({
        data: {
          email,
          role: targetRole,
          passwordHash: "google_oauth_auth",
          profile: {
            create: {
              companyName,
              contactPhone: null,
              category: targetRole === "ORGANIZER" ? "FESTIVAL_HOST" : "FOOD",
              verified: false,
              metadata: JSON.stringify({ source: "google_signup", picture })
            }
          }
        },
        include: {
          profile: true
        }
      });

      // Send welcome email asynchronously
      try {
        let emailHtml = "";
        let subject = "Welcome to Ground Zero!";
        
        if (targetRole === "ORGANIZER") {
          emailHtml = getOrganizerWelcomeEmail(companyName);
          subject = "Ground Zero - Welcome to the Organizer Network!";
        } else {
          emailHtml = getVendorWelcomeEmail(companyName);
          subject = "Ground Zero - Start Booking Premium Stall Spaces";
        }

        if (emailHtml) {
          sendEmail({
            to: email,
            subject,
            html: emailHtml
          }).catch(err => {
            console.error("Google Auth welcome email sending failed:", err);
          });
        }
      } catch (emailError) {
        console.error("Google Auth signup email formatting/trigger failed:", emailError);
      }
    }

    return NextResponse.json(
      {
        message: "Google login successful.",
        isNewUser,
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
    console.error("Google login API error:", error);
    return NextResponse.json(
      { message: "Google login server failure.", error: error.message },
      { status: 500 }
    );
  }
}
