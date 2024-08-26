import prisma from "@/lib/prisma";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  let url = new URL(String(req.url));
  const natureCurrent = url.searchParams.get("natureCurrent") as string;
  try {
    const natureinfo = await prisma.natureInfo.findFirst({
      where: {
        natureID: parseInt(natureCurrent)
      }
    });
    return NextResponse.json(natureinfo);
  } catch (error) {
    return NextResponse.json({error: error});
  }
}