import prisma from "@/lib/prisma";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  let url = new URL(String(req.url));
  const id = url.searchParams.get("itemid") as string;
  try {
    const iteminfo = await prisma.itemInfo.findFirst({
      where: {
        itemID: parseInt(id)
      }
    });
    return NextResponse.json(iteminfo);
  } catch (error) {
    return NextResponse.json({error: error});
  }
}