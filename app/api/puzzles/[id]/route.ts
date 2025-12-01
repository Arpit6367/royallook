import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const puzzleId = params.id;

    if (!puzzleId) {
      return NextResponse.json(
        { error: "Puzzle ID required" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Only allow valid puzzle fields to be updated
    const allowedFields = ["title", "fen", "solution", "category", "folderId"];
    const updateData: any = {};

    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updateData[key] = body[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const puzzle = await prisma.puzzle.update({
      where: { id: puzzleId },
      data: updateData,
    });

    return NextResponse.json(puzzle);
  } catch (error) {
    console.error("Error updating puzzle:", error);
    return NextResponse.json(
      { error: "Failed to update puzzle" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const puzzleId = params.id;

    if (!puzzleId) {
      return NextResponse.json(
        { error: "Puzzle ID required" },
        { status: 400 }
      );
    }

    await prisma.puzzle.delete({
      where: { id: puzzleId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting puzzle:", error);
    return NextResponse.json(
      { error: "Failed to delete puzzle" },
      { status: 500 }
    );
  }
}
