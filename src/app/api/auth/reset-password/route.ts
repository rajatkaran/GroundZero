import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";

// Simple global memory store for temporary OTPs (for production serverless, Redis or DB is ideal, but this works for demo sessions)
const otpStore = new Map<string, string>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, step, otp, newPassword } = body;

    if (!email) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ message: "No account found with this email." }, { status: 404 });
    }

    if (step === 1) {
      // Generate a real 6-digit random code
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      otpStore.set(email, generatedOtp);

      // Send the actual email via Resend
      await sendEmail({
        to: email,
        subject: "Ground Zero - Password Reset Verification",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 25px; max-width: 600px; margin: auto; border: 1px solid #eaeaea; border-radius: 8px; color: #333;">
            <h2 style="color: #0070f3; margin-bottom: 20px;">Password Reset Request</h2>
            <p>We received a request to reset the password for your Ground Zero account associated with <strong>${email}</strong>.</p>
            <p>Please use the following 6-digit verification code to complete your reset process:</p>
            <div style="font-size: 28px; font-weight: bold; background-color: #f6f8fa; border: 1px solid #d0d7de; padding: 12px 24px; display: inline-block; letter-spacing: 5px; border-radius: 6px; margin: 15px 0; color: #2429f; text-align: center;">
              ${generatedOtp}
            </div>
            <p style="font-size: 14px; color: #666; margin-top: 20px;">Note: You can also use the bypass test code <strong>654321</strong> to skip this check during testing.</p>
            <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 30px 0;" />
            <p style="font-size: 12px; color: #888;">If you did not request this password reset, please ignore this email or contact support if you have concerns.</p>
          </div>
        `
      });

      return NextResponse.json({
        message: "Reset code sent to your email.",
        otp: "654321" // Maintain bypass code visibility for test UI
      }, { status: 200 });
    } else if (step === 2) {
      // Step 2: Verify OTP and save new password
      if (!otp || !newPassword) {
        return NextResponse.json({ message: "OTP and new password are required." }, { status: 400 });
      }

      const savedOtp = otpStore.get(email);
      const isValidOtp = otp === "654321" || (savedOtp && otp === savedOtp);

      if (!isValidOtp) {
        return NextResponse.json({ message: "Invalid verification code." }, { status: 400 });
      }

      // Update password in database
      await prisma.user.update({
        where: { email },
        data: {
          passwordHash: newPassword
        }
      });

      // Clear memory reference
      otpStore.delete(email);

      return NextResponse.json({
        message: "Password reset successful. You can now log in with your new password."
      }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Invalid step parameter." }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Password Reset API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}
