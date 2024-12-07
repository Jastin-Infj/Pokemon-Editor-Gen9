import prisma from "@/lib/prisma";
import { NextRequest , NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let url = new URL(String(req.url));
  const abilityidCurrent = url.searchParams.get("abilityidCurrent") as string;
  try {
    const abilityinfo = await prisma.abilityInfo.findFirst({
      where: {
        abilityID: parseInt(abilityidCurrent)
      }
    });
    return NextResponse.json(abilityinfo);
  } catch (error) {
    return NextResponse.json({error: error});
  }
}