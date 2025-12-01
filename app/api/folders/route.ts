import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parentId = searchParams.get("parentId");
  const stage = searchParams.get("stage");

  const whereClause: any = {};
  
  // If we are looking inside a folder
  if (parentId && parentId !== 'root') {
    whereClause.parentId = parentId;
  } 
  // If we are at the root level of a Stage
  else if (stage) {
    whereClause.stage = stage;
    whereClause.parentId = null;
  }

  const folders = await prisma.folder.findMany({
    where: whereClause,
    include: { _count: { select: { children: true, puzzles: true } } }
  });

  const puzzles = parentId && parentId !== 'root' ? await prisma.puzzle.findMany({
    where: { folderId: parentId }
  }) : [];

  return NextResponse.json({ folders, puzzles });
}

export async function POST(req: Request) {
  const body = await req.json();
  const folder = await prisma.folder.create({
    data: {
      name: body.name,
      stage: body.stage || null,
      parentId: body.parentId || null
    }
  });
  return NextResponse.json(folder);
}