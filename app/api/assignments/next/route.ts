import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/assignments/next?currentId=123
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const currentId = searchParams.get("currentId");

    if (!currentId) {
      return NextResponse.json({ error: "currentId is required" }, { status: 400 });
    }

    // Fetch all active TODO assignments sorted by order (or createdAt)
    const assignments = await prisma.assignment.findMany({
      where: {
        status: "pending",   // adjust if your status field is different
      },
      orderBy: {
        order: "asc",        // change if using position, index, createdAt, etc.
      },
      select: {
        id: true,
      },
    });

    if (!assignments.length) {
      return NextResponse.json({ id: null }); // no assignments at all
    }

    // Find current index
    const index = assignments.findIndex(a => a.id === currentId);

    // Edge case: current not found
    if (index === -1) {
      return NextResponse.json({ id: null });
    }

    // Get next assignment
    const nextAssignment = assignments[index + 1];

    return NextResponse.json({
      id: nextAssignment ? nextAssignment.id : null,
    });

  } catch (error) {
    console.error("Error fetching next assignment:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
