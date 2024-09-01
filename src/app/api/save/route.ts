import prisma from "@/lib/prisma";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { userInfo } from "os";

export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
    if(data.userID) {
      await prisma.userSaveData.create({
        data: {
          column: data.column,
          PokemonID: data.pokemonID,
          move1: data.move1,
          move2: data.move2,
          move3: data.move3,
          move4: data.move4,
          ability: data.ability,
          item: data.item,
          nature: data.nature,
          teratype: data.teraType,
          level: data.level,
          Ivs: data.ivs,
          Evs: data.evs,
          userinfo: {
            connect: {
              userID: data.userID
            }
          }
        }
      });
    } else {
      await prisma.userSaveData.create({
        data: {
          column: data.column,
          PokemonID: data.pokemonID,
          move1: data.move1,
          move2: data.move2,
          move3: data.move3,
          move4: data.move4,
          ability: data.ability,
          item: data.item,
          nature: data.nature,
          teratype: data.teraType,
          level: data.level,
          Ivs: data.ivs,
          Evs: data.evs
        }
      });
    }
    return NextResponse.json({status: "success"});
  } catch (error) {
    return NextResponse.json({error: error});
  }
}