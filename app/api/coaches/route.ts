import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const coaches = await prisma.user.findMany({
    where: { role: "COACH" },
    include: { students: true },
  });

  return NextResponse.json(coaches);
}
