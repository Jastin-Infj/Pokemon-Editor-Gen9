import prisma from "@/lib/prisma";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  let url = new URL(String(req.url));
  const id = url.searchParams.get("id") as string;
  try {
    const dexInfo = await prisma.dexInfo.findFirst({
      where: {
        nationalDexAPI: parseInt(id)
      }
    });
    return NextResponse.json(dexInfo);
  } catch (error) {
    return NextResponse.json({error: error});
  }
}