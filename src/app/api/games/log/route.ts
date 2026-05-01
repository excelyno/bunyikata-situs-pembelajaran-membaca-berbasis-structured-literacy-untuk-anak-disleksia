import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { sessionId, targetItem, answeredItem, isCorrect, responseTimeMs, errorCategory } = await req.json();

    // Simpan log jawaban ke database
    const log = await prisma.answerLog.create({
      data: {
        sessionId,
        targetItem,
        answeredItem,
        isCorrect,
        responseTimeMs,
        errorCategory, // Ini yang tadi abang bilang: "MOTORIK", "VISUAL", atau "AUDITORY"
      },
    });

    return NextResponse.json({ success: true, logId: log.id });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mencatat log" }, { status: 500 });
  }
}