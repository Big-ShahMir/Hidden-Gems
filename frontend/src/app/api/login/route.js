import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  const { username, password } = await req.json();

    const user = prisma.user.create({
        data: {
            username: username,
            password: password
        }
    })

    return NextResponse.json(user);
}