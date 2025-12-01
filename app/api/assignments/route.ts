// src/app/api/assignments/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const { studentId, puzzleId } = await req.json();

  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const assignment = await prisma.assignment.create({
    data: {
      studentId,
      puzzleId,
      assignedBy: session.user?.email || "Unknown",
    },
  });
  return NextResponse.json(assignment);
}

export async function GET(req: Request) {
  // Get assignments for a specific student (pass ?studentId=...)
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");

  if (!studentId) return NextResponse.json({ error: "Student ID required" }, { status: 400 });

  const assignments = await prisma.assignment.findMany({
    where: { studentId },
    include: { puzzle: true },
    orderBy: { assignedAt: 'desc' }
  });
  return NextResponse.json(assignments);
}