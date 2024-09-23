"use server";
import { PBaseProps, RequestPokemonData, UserData } from "@/types";
import { headers } from "next/headers";
import React from "react";
import { Create_PBaseProps, reducer_RequestPokemonData } from "./reducer/P_Datas";


interface ImportSaveData {
  f_userID: string,
  column: number,
  id: number,
  PokemonID: number,
  PokemonName: string | null,
  move1: number,
  move2: number,
  move3: number,
  move4: number,
  ability: number,
  item: number,
  nature: number,
  teratype: number,
  level: number,
  Ivs: string,
  Evs: string
}

const Import = async () => { 
  console.log("--- Import Start ---");
  const headerList = headers();
  const origin = headerList.get('host');
  
  const FetchData = async () => {
    //! 初期設定 
    let param: UserData = {
      userID: "test",
      userName: "test"
    };

    try {
      const res = await fetch(`http://${origin}/api/user?userID=${param.userID}&userName=${param.userName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const user: UserData = await res.json();
      if(!user) return null;

      const res2 = await fetch(`http://${origin}/api/save?userID=${user.userID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const savedata = await res2.json();
      return [user , savedata];
    } catch (error) {
      console.log(error);
    }
  };

  const FetchPokemonData = async (datas: ImportSaveData[]): Promise<PBaseProps[]> => {
    datas.sort((a , b) => {
      return a.column - b.column;
    });

    let results: PBaseProps[] = [];
    await Promise.all(datas.map(async (data) => {
      let format: RequestPokemonData = {
        nationalAPI: data.PokemonID,
        id: data.id,
        move1: data.move1,
        move2: data.move2,
        move3: data.move3,
        move4: data.move4,
        ability: data.ability,
        item: data.item,
        natureCurrent: data.nature,
        teraTypeCurrent: data.teratype
      };
      const res =  await reducer_RequestPokemonData({type: "Import", payload: format});

      let newPBase = Create_PBaseProps("FETCH", res , Number(data.id));
      if(newPBase) results.push(newPBase);
    }));
    return results;
  };

  // Main Process
  try {
    const datas = await FetchData();
    if(!datas) return { error: "No Data"};
    let userData = datas[0];
    let savedata = datas[1] as ImportSaveData[];
    const pokemonDatas = await FetchPokemonData(savedata);
    console.log("--- Import End ---");
    return [userData , pokemonDatas];
  } catch (error) {
    console.error('Error in Import:', error);
    return { error: error };
  }
};
export default Import;