import prisma from "@/lib/prisma";
import { UserData } from "@/types";
import { NextApiRequest } from "next";
import { NextRequest , NextResponse } from "next/server";

async function create(param: UserData) {
  try {
    await prisma.userLogin.create({
      data: {
        userID: param.userID,
        userName: param.userName,
        root: param.root
      }
    });
    return NextResponse.json({status: "success"});
  } catch (error) {
    return NextResponse.json({error: error});
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  switch(data.type) {
    case "CREATE":
      return await create(data.userdata);
    default:
      return NextResponse.json({error: "Invalid type."});
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