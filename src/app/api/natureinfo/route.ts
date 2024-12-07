import prisma from "@/lib/prisma";
import { NextRequest , NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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