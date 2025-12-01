import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  // We now expect 'folderId' in the body
  const puzzle = await prisma.puzzle.create({
    data: {
      title: body.title,
      fen: body.fen,
      solution: body.solution,
      category: body.category,
      folderId: body.folderId
    }
  });
  return NextResponse.json(puzzle);
}