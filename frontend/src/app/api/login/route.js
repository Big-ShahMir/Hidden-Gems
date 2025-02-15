import { PrismaClient } from "@prisma/client/extension";
import { NextResponse } from "next/server";

const prisma = new PrismaClient;

async function POST(req) {
  const { username, password } = req.body;

    const user = prisma.user.create({
        data: {
            username: username,
            password: password
        }
    })

    return NextResponse.json(user);
}