import { PBaseProps, RequestPokemonData } from "@/types";
import prisma from "@/lib/prisma";

function reducer_P_Datas(valueData: PBaseProps[], action: any) {
  switch(action.type) {
    case "ADD":
      return [...valueData, action.payload];
    case "REMOVE":
      return valueData.filter((data) => data.id !== action.payload);
    case "UPDATE":
      return valueData.map((data) => {
        if(data.id === action.payload.id) {
          return {
            ...data,
            ...action.payload
          };
        } else {
          return data;
        }
      });
    default:
      return valueData;
  }
}

async function reducer_RequestPokemonData(requestData: RequestPokemonData , action:any) {
  let createFormat: PBaseProps = {
    id: "001",
    name: "ポケモン",
    move1: "わざ1",
    move2: "わざ2",
    move3: "わざ3",
    move4: "わざ4",
    ability: "とくせい",
    item: "アイテム",
    nature: "せいかく",
    teratype: "テラスタル",
  };
  let res;

  switch(action.type) {
    case "ADD":
      console.log("--- test ---");
      return reducer_DBRequest(requestData , {type: "GET_DEX"});
    case "UPDATE":
      return {
        ...requestData,
        ...action.payload
      };
    default:
      return requestData;
  }
};

async function reducer_DBRequest(requestData: RequestPokemonData , action:any) {
  let res;
  switch(action.type) {
    case "GET_DEX":
      res = await prisma.dexInfo.findMany({
        where: {
          id: requestData.id
        }
      });
      return res;
    default:
      break;
  }
  return Promise.resolve(null);
};

export { reducer_P_Datas, reducer_RequestPokemonData, reducer_DBRequest };