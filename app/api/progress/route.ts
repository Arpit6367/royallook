import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { studentId, puzzleId, isCorrect, wrongMove } = await req.json();

    // 1. Get current progress to handle mistakes array safely
    const existingProgress = await prisma.progress.findUnique({
      where: {
        studentId_puzzleId: { studentId, puzzleId }
      }
    });

    // Handle Mistakes Array (JSON)
    let mistakesList = existingProgress ? (existingProgress.mistakes as string[]) || [] : [];
    if (wrongMove) {
      mistakesList.push(wrongMove);
    }

    // 2. Update or Create Progress (Stats)
    const progress = await prisma.progress.upsert({
      where: {
        studentId_puzzleId: { studentId, puzzleId }
      },
      update: {
        // If it was already solved, keep it solved. If new solve, mark true.
        isSolved: isCorrect ? true : existingProgress?.isSolved, 
        attempts: { increment: 1 },
        mistakes: mistakesList,
        lastPlayed: new Date()
      },
      create: {
        studentId,
        puzzleId,
        isSolved: isCorrect,
        attempts: 1,
        mistakes: wrongMove ? [wrongMove] : []
      }
    });

    // 3. CRITICAL FIX: Update the Assignment Table
    // This removes it from "To Do" and moves it to "History"
    if (isCorrect) {
      await prisma.assignment.updateMany({
        where: {
          studentId: studentId,
          puzzleId: puzzleId
        },
        data: {
          isCompleted: true
        }
      });
    }

    return NextResponse.json(progress);

  } catch (error) {
    console.error("Progress Error:", error);
    return NextResponse.json({ error: "Failed to save progress" }, { status: 500 });
  }
}

// GET method for fetching progress history
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");

  if (!studentId) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const progress = await prisma.progress.findMany({
    where: { studentId },
    orderBy: { lastPlayed: 'desc' }
  });

  return NextResponse.json(progress);
}