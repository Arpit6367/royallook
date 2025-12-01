import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const puzzle = await prisma.puzzle.findUnique({
      where: { id: params.id }
    });
    
    if (!puzzle) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(puzzle);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}