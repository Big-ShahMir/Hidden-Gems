import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username: username },
    });

    if (existingUser) {
      if (existingUser.password !== password) {
        return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
      }
      return NextResponse.json({ message: "Login successful", messageType: "login", user: existingUser });
    }

    const newUser = await prisma.user.create({
      data: { username, password },
    });

    return NextResponse.json({ message: "Account created!", messageType: "signup", user: newUser });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
