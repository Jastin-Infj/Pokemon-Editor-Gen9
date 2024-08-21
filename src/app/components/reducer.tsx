import { PBaseProps, RequestPokemonData } from "@/types";
import prisma from "@/lib/prisma";
import axios from "axios";

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
      res = await reducer_DBRequest(requestData , {type: "GET_DEX"});
      Promise.all([res]).then((res_data) => {
        return Promise.resolve(res_data);
      });
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
      try {
        await axios.post('/api', {id: requestData.id}).then((res) => {
          console.log(res);
        });
      } catch (error) {
        return Promise.reject(new Error("Internal Server Error"));
      }
      break;
    default:
      break;
  }
};

export { reducer_P_Datas, reducer_RequestPokemonData, reducer_DBRequest };