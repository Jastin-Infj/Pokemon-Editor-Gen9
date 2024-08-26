import prisma from "@/lib/prisma";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  let url = new URL(String(req.url));
  let move1id = url.searchParams.get("move1id") as string;
  let move2id = url.searchParams.get("move2id") as string;
  let move3id = url.searchParams.get("move3id") as string;
  let move4id = url.searchParams.get("move4id") as string;
  try {
    const moveinfo = await prisma.moveInfo.findMany({
      where: {
        OR: [
          { moveID: parseInt(move1id) },
          { moveID: parseInt(move2id) },
          { moveID: parseInt(move3id) },
          { moveID: parseInt(move4id) }
        ]
      }
    });
    return NextResponse.json(moveinfo);
  } catch (error) {
    return NextResponse.json({error: error});
  }
}