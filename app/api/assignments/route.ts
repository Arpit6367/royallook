import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// ---------------------------------------------
// POST – Assign puzzle(s) to a student
// ---------------------------------------------
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Input: studentId, itemId (puzzleId or folderId), and type
    const { studentId, itemId, type, puzzleId } = await req.json();

    // 1. Validate Input
    // Support legacy 'puzzleId' if 'itemId' is missing
    const targetId = itemId || puzzleId; 
    const targetType = type || 'PUZZLE'; // Default to single puzzle if type missing

    if (!studentId || !targetId) {
      return NextResponse.json(
        { error: "studentId and ID are required" },
        { status: 400 }
      );
    }

    // 2. Authorization Check
    const userRole = (session.user as any)?.role;
    if (userRole !== "ADMIN" && userRole !== "COACH") {
      return NextResponse.json(
        { error: "Only coaches or admins can assign puzzles" },
        { status: 403 }
      );
    }

    // 3. Verify Student Exists
    const student = await prisma.user.findUnique({ where: { id: studentId } });
    if (!student || student.role !== "STUDENT") {
      return NextResponse.json({ error: "Invalid student" }, { status: 404 });
    }

    // ---------------------------------------------------------
    // SCENARIO A: BULK ASSIGN FOLDER
    // ---------------------------------------------------------
    if (targetType === 'FOLDER') {
      // 1. Find all puzzles in this folder
      const puzzlesInFolder = await prisma.puzzle.findMany({
        where: { folderId: targetId },
        select: { id: true }
      });

      if (puzzlesInFolder.length === 0) {
        return NextResponse.json({ message: "Folder is empty", count: 0 });
      }

      // 2. Prepare data for bulk insert
      const assignmentsData = puzzlesInFolder.map(p => ({
        studentId,
        puzzleId: p.id,
        assignedBy: session.user?.email || "Unknown",
        // status: 'PENDING', // Uncomment if your schema has a default status you need to override
      }));

      // 3. Execute Bulk Insert (skipDuplicates ignores already assigned puzzles)
      const result = await prisma.assignment.createMany({
        data: assignmentsData,
        skipDuplicates: true 
      });

      return NextResponse.json({ 
        message: "Folder assigned successfully", 
        count: result.count 
      });
    }

    // ---------------------------------------------------------
    // SCENARIO B: SINGLE PUZZLE ASSIGNMENT
    // ---------------------------------------------------------
    else {
      // 1. Check if puzzle exists
      const puzzle = await prisma.puzzle.findUnique({ where: { id: targetId } });
      if (!puzzle) {
        return NextResponse.json({ error: "Puzzle not found" }, { status: 404 });
      }

      // 2. Prevent duplicate assignment
      const alreadyAssigned = await prisma.assignment.findFirst({
        where: { studentId, puzzleId: targetId }
      });

      if (alreadyAssigned) {
        return NextResponse.json(
          { error: "This puzzle is already assigned to this student" },
          { status: 409 }
        );
      }

      // 3. Create Assignment
      const assignment = await prisma.assignment.create({
        data: {
          studentId,
          puzzleId: targetId,
          assignedBy: session.user?.email || "Unknown",
        }
      });

      return NextResponse.json(assignment);
    }

  } catch (e) {
    console.error("Assignment POST error:", e);
    return NextResponse.json(
      { error: "Failed to assign homework" },
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