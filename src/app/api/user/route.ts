import prisma from "@/lib/prisma";
import { NextApiRequest } from "next";
import { NextRequest , NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userID, userName, root } = await req.json();
  try {
    await prisma.userLogin.create({
      data: {
        userID: userID,
        userName: userName,
        root: root
      }
    });
    return NextResponse.json({status: "success"});
  } catch (error) {
    return NextResponse.json({error: error});
  }
}