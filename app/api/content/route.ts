import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const stage = searchParams.get("stage");
  const parentId = searchParams.get("parentId");

  const whereClause: any = {};
  if (parentId) whereClause.parentId = parentId;
  else if (stage) {
    whereClause.stage = stage;
    whereClause.parentId = null;
  }

  const folders = await prisma.folder.findMany({ where: whereClause });
  const puzzles = parentId ? await prisma.puzzle.findMany({ where: { folderId: parentId } }) : [];

  return NextResponse.json({ folders, puzzles });
}

export async function POST(req: Request) {
  const body = await req.json();
  
  if (body.type === 'FOLDER') {
    const folder = await prisma.folder.create({
      data: { name: body.name, stage: body.stage, parentId: body.parentId }
    });
    return NextResponse.json(folder);
  } 
  
  if (body.type === 'PUZZLE') {
    const puzzle = await prisma.puzzle.create({
      data: { title: body.title, fen: body.fen, solution: body.solution, folderId: body.folderId }
    });
    return NextResponse.json(puzzle);
  }
}