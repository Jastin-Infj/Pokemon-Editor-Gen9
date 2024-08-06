"use server";
import prisma from "@/lib/prisma";
import { PokemonClient  , MoveClient } from 'pokenode-ts';
import { PokemonAPIObject, PokemonDataBase } from '@/types';

import fs from 'fs';
import JSON_POKEMON_DEX from "../../json/pokemonDex.json";
import JSON_POKEMON_INFO from "../../json/pokemonInfo.json";

const JSON_POKEMON_DEX_PATH = "./src/json/pokemonDex.json";
const JSON_POKEMON_INFO_PATH = "./src/json/pokemonInfo.json";

export const Access = () => {
  const dataFormat: PokemonDataBase = {
    id: null,
    nameJa: null,
    nameEn: null,
    type1: null,
    type2: null,
    ability1: null,
    ability2: null,
    abilityH: null,
    basestatus: {
      hp: null,
      attack: null,
      defense: null,
      spattack: null,
      spdefense: null,
      speed: null
    },
    moves: []
  };

  const handlePokemon = async (): Promise<PokemonAPIObject[]> => {

    if(JSON_POKEMON_DEX !== undefined) {
      return Promise.resolve(JSON_POKEMON_DEX);
    }

    const api = new PokemonClient(); // create a PokemonClient
    let allPokemon: PokemonAPIObject[] = [];
    let offset = 0;
    const LIMIT = 100;

    // 100件ずつ取得する
    while (true) {
      const pokemonList = await api.listPokemons(offset, LIMIT);
      allPokemon = allPokemon.concat(pokemonList.results);
      offset += LIMIT;
      if (pokemonList.results.length < LIMIT) {
        fs.writeFileSync(JSON_POKEMON_DEX_PATH, JSON.stringify(allPokemon, null, 2));
        return allPokemon;
      }
    }
  };

  const handleTypes = async (): Promise<PokemonAPIObject[]> => {
    const api = new PokemonClient(); // create a PokemonClient
    let allTypes: PokemonAPIObject[] = [];
    let offset = 0;
    const LIMIT = 25;

    // 25件ずつ取得する
    while (true) {
      const typeList = await api.listTypes(offset, LIMIT);
      allTypes = allTypes.concat(typeList.results);
      offset += LIMIT;
      if (typeList.results.length < LIMIT) {
        return allTypes;
      }
    }
  };

  const handleMoves = async (): Promise<PokemonAPIObject[]> => {
    const api = new MoveClient(); // create a PokemonClient
    let allMoves: PokemonAPIObject[] = [];
    let offset = 0;
    const LIMIT = 100;

    // 100件ずつ取得する
    while (true) {
      const moveList = await api.listMoves(offset, LIMIT);
      allMoves = allMoves.concat(moveList.results);
      offset += LIMIT;
      if (moveList.results.length < LIMIT) {
        return allMoves;
      }
    }
  };

  const handleAbility = async (): Promise<PokemonAPIObject[]> => {
    const api = new PokemonClient();
    let allAbility:PokemonAPIObject[] = [];
    let offset = 0;
    const LIMIT = 100;

    // 100件ずつ取得する
    while (true) {
      const abilityList = await api.listAbilities(offset, LIMIT);
      allAbility = allAbility.concat(abilityList.results);
      offset += LIMIT;
      if (abilityList.results.length < LIMIT) {
        return allAbility;
      }
    }
  }

  const handleItem = async (): Promise<PokemonAPIObject[]> => {
    const api = new PokemonClient();
    let allItem:PokemonAPIObject[] = [];
    let offset = 0;
    const LIMIT = 20;

    // 20件ずつ取得する
    while (true) {
      let url = `https://pokeapi.co/api/v2/item/?offset=${offset}&limit=${LIMIT}`;
      const itemList = await fetch(url);
      const datas = await itemList.json();

      allItem = allItem.concat(datas.results);
      offset += LIMIT;
      if (datas.results.length < LIMIT) {
        return allItem;
      }
    }
  };

  // 25件ですべて
  const handleNature = async (): Promise<PokemonAPIObject[]> => {
    const api = new PokemonClient();
    let allNature:PokemonAPIObject[] = [];
    let offset = 0;
    const LIMIT = 25;

    // 25件ずつ取得する
    while (true) {
      let url = `https://pokeapi.co/api/v2/nature/?offset=${offset}&limit=${LIMIT}`;
      const natureList = await fetch(url);
      const datas = await natureList.json();

      allNature = allNature.concat(datas.results);
      offset += LIMIT;
      if (datas.results.length < LIMIT) {
        return allNature;
      }
    }
  }

  async function getPosts() {
    const posts = await prisma.dexINFO.findMany();
    return posts;
  }

  // const posts = getPosts();
  // posts.then((data) => {
  //   console.log(data[1]);
  // });

  // 外部キー制約により順番を決める
  const InsertDexInfo = async () => {
    const api = new PokemonClient();

    let DexInfo  = await handlePokemon();
    console.log("DexInfo Fin");
    console.log(DexInfo);

    // let TypeInfo = handleTypes();
    // let MoveInfo = handleMoves();
    // let AbilityInfo = handleAbility();
    // let ItemInfo = handleItem();
    // let NatureInfo = handleNature();

    // 全ての処理が終わるまで待つ
    // Promise.all([DexInfo]).then((results) => {
      
    //   // DexInfo のURLを参照する
    //   let dex = results[0];

    //   // それぞれの情報を取得する
    //   let Param_Name_JA = "";
    //   let Param_Name_EN = "";

    //   let Pokemoninfo;
    //   // すべての非同期処理を待機
    //   if(JSON_POKEMON_INFO !== undefined) {
    //     Pokemoninfo = Promise.resolve(JSON_POKEMON_INFO);
    //   } else {
    //     Pokemoninfo = Promise.all(dex.map(async (data) => {
    //       const res = await fetch(data.url);
    //       const json = await res.json();
    //       return Promise.resolve(json);
    //     }));
    //   }
      
    //   // 日本語の名前を取得
    //   return Pokemoninfo.then((datas:any) => {
    //     console.log("Pokemoninfo Fin");
    //     console.log(typeof datas);

    //     if(JSON_POKEMON_INFO === undefined) {
    //       fs.writeFileSync(JSON_POKEMON_INFO_PATH, JSON.stringify(datas, null, 2));
    //     }

    //     // 情報源を取得
    //     let SpecInfo = Promise.all(datas.map(async (data:any) => {
    //       console.log("Check : " + data.id);

    //       const url = `https://pokeapi.co/api/v2/pokemon-species/${data.id}/`;
    //       const res = await fetch(url);
    //       // 404エラーが出た場合はnullを返す
    //       if(res.status === 404) return { id: data.id , names: null};

    //       const json:any = await res.json();
    //       return Promise.resolve(json);
    //     })).then((res) => {
          
    //       let test = res.map(async (data) => {

    //         if(data.names === null) {
    //           //console.log([data.id, "" , data.nameEn]);
    //           return Promise.resolve(data);
    //         }

    //         // 日本語名と英語名を取得
    //         data.names.map(async (nameParam:any) => {
    //           switch (nameParam.language.name) {
    //             case "ja":
    //               Param_Name_JA = nameParam.name;
    //               break;
    //             case "en":
    //               Param_Name_EN = nameParam.name;
    //               break;
    //           }
    //         });

    //         //console.log([data.id , Param_Name_JA , Param_Name_EN]);

    //         const json = {
    //           id: data.id,
    //           nameJa: Param_Name_JA,
    //           nameEn: Param_Name_EN,
    //         };
    //         return Promise.resolve(json);
    //       });

    //       Promise.all([test]).then((res) => {
    //         // console.log(res);
    //       });

    //     });
    //   });

    // });
  }

  InsertDexInfo();

  return (
    <button>test</button>
  );
};

export default Access;