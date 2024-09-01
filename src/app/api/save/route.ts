import prisma from "@/lib/prisma";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function POST(req: NextApiRequest) {
  const reqBody = req.body;
  console.log(reqBody);
  try {
    await prisma.userSaveData.create({
      data: {
        column: reqBody.column,
        PokemonID: reqBody.pokemonID,
        PokemonName: reqBody.pokemonName,
        move1: reqBody.move1,
        move2: reqBody.move2,
        move3: reqBody.move3,
        move4: reqBody.move4,
        ability: reqBody.ability,
        item: reqBody.item,
        nature: reqBody.nature,
        teratype: reqBody.teraType,
        level: reqBody.level,
        Ivs: reqBody.ivs,
        Evs: reqBody.evs
      }
    });
    await prisma.$disconnect();
    return NextResponse.json({status: "success"});
  } catch (error) {
    return NextResponse.json({error: error});
  }
}