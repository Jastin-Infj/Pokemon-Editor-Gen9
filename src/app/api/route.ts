import prisma from "@/lib/prisma";
import { NextApiRequest , NextApiResponse } from "next";

export async function POST(req: NextApiRequest , res: NextApiResponse) {
  try {
    const dexInfo = await prisma.dexInfo.findMany({
      where: {
        id: 1
      }
    });
    res.status(200).json(dexInfo);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}