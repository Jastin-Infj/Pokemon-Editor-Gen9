import prisma from "@/lib/prisma";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

interface MoveResponse {
  moveID: number;
  moveName: string | null;
};

export async function GET(req: NextApiRequest) {
  let url = new URL(String(req.url));
  let move1id = url.searchParams.get("move1id") as string;
  let move2id = url.searchParams.get("move2id") as string;
  let move3id = url.searchParams.get("move3id") as string;
  let move4id = url.searchParams.get("move4id") as string;

  let result:Array<any> = [];

  const GetMethod = async (id: string): Promise<MoveResponse> => {
    const res = await prisma.moveInfo.findFirst({
      where: {
        moveID: parseInt(id)
      }
    });
    if(!res) {
      return {moveID: 0, moveName: null};
    } else {
      return res;
    }
  }

  try {
    // requestの順番準拠
    let move1res = await GetMethod(move1id);
    let move2res = await GetMethod(move2id);
    let move3res = await GetMethod(move3id);
    let move4res = await GetMethod(move4id);

    result.push(move1res);
    result.push(move2res);
    result.push(move3res);
    result.push(move4res);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({error: error});
  }
}