import prisma from "@/lib/prisma";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  let url = new URL(String(req.url));
  const type1 = url.searchParams.get("type1") as string;
  const type2 = url.searchParams.get("type2") as string;

  const teraTypeCurrent = url.searchParams.get("teraTypeCurrent") as string;

  // テラスタルではない場合
  if(!teraTypeCurrent) {
    try {
      const typeInfo1 = await prisma.typeInfo.findFirst({
        where: {
          typeID: parseInt(type1)
        }
      });
      const typeInfo2 = await prisma.typeInfo.findFirst({
        where: {
          typeID: parseInt(type2)
        }
      });
      return NextResponse.json({typeInfo1 , typeInfo2});
    } catch (error) {
      return NextResponse.json({error: error});
    }
  }

  try {
    const typeInfo = await prisma.typeInfo.findFirst({
      where: {
        typeID: parseInt(teraTypeCurrent)
      }
    });
    return NextResponse.json(typeInfo);
  } catch (error) {
    return NextResponse.json({error: error});
  }
 
}