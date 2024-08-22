import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {  
  let url = new URL(String(req.url));
  const basenationalDexAPI = url.searchParams.get("basenationalDexAPI") as string;
  try {
    const dexInfo = await prisma.baseInfo.findFirst({
      where: {
        basenationalDexAPI: parseInt(basenationalDexAPI as string)
      }
    });
    console.log(dexInfo);
    return NextResponse.json(dexInfo);
  } catch (error) {
    return NextResponse.json({error: error});
  }
}