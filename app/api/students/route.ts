import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: { coach: true },
  });

  return NextResponse.json(students);
}
