import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ reports }, { status: 200 });
  } catch (error: any) {
    console.error("Reports Fetch API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, period, title, data } = body;

    if (!type || !period || !title || !data) {
      return NextResponse.json(
        { message: "Missing required parameters to generate/store report." },
        { status: 400 }
      );
    }

    const report = await prisma.report.create({
      data: {
        type,
        period,
        title,
        data: typeof data === "string" ? data : JSON.stringify(data)
      }
    });

    return NextResponse.json({ report }, { status: 201 });
  } catch (error: any) {
    console.error("Report Save API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error.message },
      { status: 500 }
    );
  }
}
