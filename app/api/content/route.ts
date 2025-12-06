import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const stage = searchParams.get("stage");
    const parentId = searchParams.get("parentId");

    const whereClause: any = {};

    // 1. Determine Folder filters
    if (parentId) {
      whereClause.parentId = parentId;
    } else if (stage) {
      // Root folders for a specific stage
      whereClause.stage = stage;
      whereClause.parentId = null;
    }

    const folders = await prisma.folder.findMany({ 
      where: whereClause,
      orderBy: { name: 'asc' }
    });

    // 2. Determine Puzzle filters
    // If parentId is present, get puzzles in that folder.
    // If parentId is missing but we are just querying content, we might return empty or root puzzles depending on your UI logic.
    let puzzles = [];
    if (parentId) {
       puzzles = await prisma.puzzle.findMany({
          where: { folderId: parentId },
          orderBy: { title: 'asc' }
        });
    }

    return NextResponse.json({ folders, puzzles });
  } catch (error) {
    console.error("GET /content error:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.type) {
      return NextResponse.json({ error: "Missing type" }, { status: 400 });
    }

    // --- CREATE FOLDER ---
    if (body.type === "FOLDER") {
      if (!body.name || !body.stage) {
        return NextResponse.json({ error: "Name and Stage required" }, { status: 400 });
      }

      const folder = await prisma.folder.create({
        data: {
          name: body.name,
          stage: body.stage, // Enum: BEGINNER, INTERMEDIATE, ADVANCED
          parentId: body.parentId || null,
        },
      });

      return NextResponse.json(folder);
    }

    // --- CREATE PUZZLE ---
    if (body.type === "PUZZLE") {
      if (!body.title || !body.fen || !body.solution) {
        return NextResponse.json({ error: "Missing puzzle details" }, { status: 400 });
      }

      // Handle folderId: It can now be null in the schema
      const folderId = body.folderId && body.folderId !== 'root' ? body.folderId : null;

      const puzzle = await prisma.puzzle.create({
        data: {
          title: body.title,
          fen: body.fen,
          solution: body.solution,
          folderId: folderId,
        },
      });

      return NextResponse.json(puzzle);
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("POST /content error:", error);
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}