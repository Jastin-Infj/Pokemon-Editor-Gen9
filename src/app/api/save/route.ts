import prisma from "@/lib/prisma";
import { RequestSavePokemonData } from "@/types";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";

async function create(param: RequestSavePokemonData) {
  try {
    await prisma.userSaveData.create({
      data: {
        column: param.column,
        PokemonID: param.nationalAPI,
        move1: param.move1,
        move2: param.move2,
        move3: param.move3,
        move4: param.move4,
        ability: param.ability,
        item: param.item,
        nature: param.nature,
        teratype: param.teraType,
        level: param.level,
        Ivs: param.ivs,
        Evs: param.evs,
        PokemonName: param.pokemonName,
        userinfo: {
          connect: {
            userID: param.userID
          }
        }
      }
    });
    return NextResponse.json({status: `create success: ${param.column}`});
  } catch (error) {
    return NextResponse.json({error: error});
  }
}

async function update(param: RequestSavePokemonData) {
  try {
    await prisma.userSaveData.update({
      where: {
        id: param.id
      },
      data: {
        column: param.column,
        PokemonID: param.nationalAPI,
        move1: param.move1,
        move2: param.move2,
        move3: param.move3,
        move4: param.move4,
        ability: param.ability,
        item: param.item,
        nature: param.nature,
        teratype: param.teraType,
        level: param.level,
        Ivs: param.ivs,
        Evs: param.evs,
        userinfo: {
          connect: {
            userID: param.userID
          }
        }
      }
    });
    return NextResponse.json({status: `update success: ${param.column}`});
  } catch (error) {
    return NextResponse.json({error: error});
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  console.log(data);

  switch(data.type) {
    case "CREATE":
      return await create(data.param);
    case "UPDATE":
      return await update(data.param);
    default:
      return NextResponse.json({error: "Invalid type."});
  }
}

export async function GET(req: NextApiRequest) {
  const url = new URL(String(req.url));
  const userID = url.searchParams.get("userID") as string;
  try {
    const data = await prisma.userSaveData.findMany({
      where: {
        userinfo: {
          userID: userID
        }
      }
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({error: error});
  }
}