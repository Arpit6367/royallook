import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// ---------------------------------------------
// POST – Assign puzzle to a student
// ---------------------------------------------
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { studentId, puzzleId } = await req.json();

    // Validate input
    if (!studentId || !puzzleId) {
      return NextResponse.json(
        { error: "studentId and puzzleId are required" },
        { status: 400 }
      );
    }

    const userRole = session.user?.role;

    // Only ADMIN or COACH can assign puzzles
    if (userRole !== "ADMIN" && userRole !== "COACH") {
      return NextResponse.json(
        { error: "Only coaches or admins can assign puzzles" },
        { status: 403 }
      );
    }

    // Prevent assigning if student/puzzle does not exist
    const student = await prisma.user.findUnique({ where: { id: studentId } });
    const puzzle = await prisma.puzzle.findUnique({ where: { id: puzzleId } });

    if (!student || student.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Invalid student" },
        { status: 404 }
      );
    }

    if (!puzzle) {
      return NextResponse.json(
        { error: "Puzzle not found" },
        { status: 404 }
      );
    }

    // Prevent duplicate assignment of same puzzle
    const alreadyAssigned = await prisma.assignment.findFirst({
      where: { studentId, puzzleId }
    });

    if (alreadyAssigned) {
      return NextResponse.json(
        { error: "This puzzle is already assigned to this student" },
        { status: 409 }
      );
    }

    const assignment = await prisma.assignment.create({
      data: {
        studentId,
        puzzleId,
        assignedBy: session.user?.email || "Unknown",
      }
    });

    return NextResponse.json(assignment);

  } catch (e) {
    console.error("Assignment POST error:", e);
    return NextResponse.json(
      { error: "Failed to assign puzzle" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------
// GET – Get assignments for a specific student
// ---------------------------------------------
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID required" },
        { status: 400 }
      );
    }

    // Get assignments with puzzle details
    const assignments = await prisma.assignment.findMany({
      where: { studentId },
      include: {
        puzzle: true
      },
      orderBy: { assignedAt: "desc" }
    });

    return NextResponse.json(assignments);

  } catch (e) {
    console.error("Assignment GET error:", e);
    return NextResponse.json(
      { error: "Failed to load assignments" },
      { status: 500 }
    );
  }
}
