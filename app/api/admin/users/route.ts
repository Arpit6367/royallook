import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET() {
  const users = await prisma.user.findMany({
    include: { coach: true, _count: { select: { students: true } } }
  });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Validation
    if (!body.email || !body.password || !body.name || !body.role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    // 2. Prepare Data (Sanitize inputs)
    const userData: any = {
      name: body.name,
      email: body.email,
      password: hashedPassword,
      role: body.role,
    };

    // Only add Student-specific fields if the role is STUDENT
    if (body.role === 'STUDENT') {
      userData.stage = body.stage || 'BEGINNER';
      // Convert empty string to null for database compatibility
      userData.coachId = body.coachId && body.coachId.trim() !== "" ? body.coachId : null;
    } else {
      // For Coaches/Admins, ensure these are null/undefined
      userData.stage = 'BEGINNER'; // Default or null depending on schema
      userData.coachId = null;
    }

    const user = await prisma.user.create({
      data: userData
    });

    return NextResponse.json(user);
  } catch (e: any) {
    console.error("Create User Error:", e);
    // Return specific error if it's a unique constraint (duplicate email)
    if (e.code === 'P2002') {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { id, ...data } = await req.json();
  // Handle password update if provided
  if (data.password) data.password = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.update({ where: { id }, data });
  return NextResponse.json(user);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}