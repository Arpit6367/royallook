import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// 1. GET: Fetch Folders and Puzzles
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const stage = searchParams.get("stage");
    const parentId = searchParams.get("parentId");

    // --- FETCH FOLDERS ---
    const whereClause: any = {};

    if (parentId && parentId !== 'root') {
      // Subfolders inside a specific folder
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

    // --- FETCH PUZZLES ---
    let puzzles = [];
    if (parentId && parentId !== 'root') {
       // Fetch puzzles inside a specific folder
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

// 2. POST: Create Folder or Puzzle
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.type) {
      return NextResponse.json({ error: "Missing type" }, { status: 400 });
    }

    // --- CREATE FOLDER ---
    if (body.type === "FOLDER") {
      // Validation: Needs name. Needs stage ONLY if it's a root folder (no parent).
      if (!body.name) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
      }
      if (!body.parentId && !body.stage) {
        return NextResponse.json({ error: "Stage is required for root folders" }, { status: 400 });
      }

      const folder = await prisma.folder.create({
        data: {
          name: body.name,
          stage: body.stage || null, // Subfolders might inherit implicitly or just be null
          parentId: body.parentId === 'root' ? null : body.parentId,
        },
      });

      return NextResponse.json(folder);
    }

    // --- CREATE PUZZLE ---
    if (body.type === "PUZZLE") {
      if (!body.title || !body.fen || !body.solution) {
        return NextResponse.json({ error: "Missing puzzle details" }, { status: 400 });
      }

      // Map 'parentId' from frontend to 'folderId' in DB
      // The frontend sends 'parentId', but your schema likely uses 'folderId' for puzzles
      let folderId = body.folderId || body.parentId;
      if (folderId === 'root') folderId = null;

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

// 3. DELETE: Remove Folder or Puzzle
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id, type } = body;

    if (!id || !type) {
      return NextResponse.json({ error: "ID and Type required" }, { status: 400 });
    }

    if (type === 'FOLDER') {
      // Note: Ensure your Prisma Schema has 'onDelete: Cascade' for children
      // otherwise this might fail if the folder has content.
      await prisma.folder.delete({
        where: { id }
      });
      return NextResponse.json({ success: true, message: "Folder deleted" });
    }

    if (type === 'PUZZLE') {
      await prisma.puzzle.delete({
        where: { id }
      });
      return NextResponse.json({ success: true, message: "Puzzle deleted" });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  } catch (error) {
    console.error("DELETE /content error:", error);
    return NextResponse.json(
      { error: "Failed to delete item. It might contain sub-items." },
      { status: 500 }
    );
  }
}