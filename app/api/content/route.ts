import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const stage = searchParams.get("stage");
    const parentId = searchParams.get("parentId");

    const whereClause: any = {};

    if (parentId) {
      // Fetch subfolders of this parent
      whereClause.parentId = parentId;
    } else if (stage) {
      // Fetch root folders for a stage
      whereClause.stage = stage;
      whereClause.parentId = null;
    }

    const folders = await prisma.folder.findMany({ where: whereClause });

    // Load puzzles only if inside a specific folder
    const puzzles = parentId
      ? await prisma.puzzle.findMany({
          where: { folderId: parentId },
        })
      : [];

    return NextResponse.json({ folders, puzzles });
  } catch (error) {
    console.error("GET /folders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch folders or puzzles" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Ensure required fields exist
    if (!body.type) {
      return NextResponse.json(
        { error: "Missing type (FOLDER or PUZZLE)" },
        { status: 400 }
      );
    }

    if (body.type === "FOLDER") {
      if (!body.name || !body.stage) {
        return NextResponse.json(
          { error: "Folder name and stage are required" },
          { status: 400 }
        );
      }

      const folder = await prisma.folder.create({
        data: {
          name: body.name,
          stage: body.stage,
          parentId: body.parentId || null,
        },
      });

      return NextResponse.json(folder);
    }

    if (body.type === "PUZZLE") {
      if (!body.title || !body.fen || !body.solution || !body.folderId) {
        return NextResponse.json(
          { error: "Puzzle title, FEN, solution, and folderId are required" },
          { status: 400 }
        );
      }

      const puzzle = await prisma.puzzle.create({
        data: {
          title: body.title,
          fen: body.fen,
          solution: body.solution,
          folderId: body.folderId,
        },
      });

      return NextResponse.json(puzzle);
    }

    return NextResponse.json(
      { error: "Invalid type value" },
      { status: 400 }
    );
  } catch (error) {
    console.error("POST /folders error:", error);
    return NextResponse.json(
      { error: "Failed to create folder or puzzle" },
      { status: 500 }
    );
  }
}
