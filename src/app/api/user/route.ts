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

export async function GET(req: NextApiRequest) {
  const url = new URL(String(req.url));
  const body = {
    userID: url.searchParams.get("userID") as string,
    userName: url.searchParams.get("userName") as string
  };
  try {
    const user = await prisma.userLogin.findFirst({
      where: {
        userID: body.userID,
        userName: body.userName
      }
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({error: error});
  }
}