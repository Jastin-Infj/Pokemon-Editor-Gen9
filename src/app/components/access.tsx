"use server";
import prisma from "@/lib/prisma";
import { PokemonClient  , MoveClient } from 'pokenode-ts';
import { PokemonAPIObject, PokemonDataBase, PokemonDataBaseName } from '@/types';

import fs from 'fs';

const JSON_POKEMON_DEX_PATH = "./src/json/pokemonDex.json";
const JSON_POKEMON_INFO_PATH = "./src/json/pokemonInfo.json";
const JSON_POKEMON_SPEC_PATH = "./src/json/pokemonSpec.json";
const JSON_POKEMON_TYPE_PATH = "./src/json/pokemonType.json";
const JSON_POKEMON_MOVE_PATH = "./src/json/pokemonMove.json"; 
const JSON_POKEMON_ABILITY_PATH = "./src/json/pokemonAbility.json";
const JSON_POKEMON_ITEM_PATH = "./src/json/pokemonItem.json";
const JSON_POKEMON_NATURE_PATH = "./src/json/pokemonNature.json";

let DEBUG_FLAG = false;

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

  let allDexInfo: PokemonAPIObject[] = [];
  let allPokemonInfo: Object[] = [];
  let allSpecInfo: Object[] = [];
  let allTypesInfo: PokemonAPIObject[] = [];
  let allMoveInfo: PokemonAPIObject[] = [];
  let allAbilityInfo: PokemonAPIObject[] = [];
  let allItemInfo: PokemonAPIObject[] = [];
  let allNatureInfo: PokemonAPIObject[] = [];

  const handlePokemon = async (): Promise<PokemonAPIObject[]> => {

    let allPokemon: PokemonAPIObject[] = [];
    // すでにファイルが存在する場合はそれを読み込む
    if(fs.existsSync(JSON_POKEMON_DEX_PATH)){
      const fileContent = fs.readFileSync(JSON_POKEMON_DEX_PATH , 'utf-8');
      const json: PokemonAPIObject[] = JSON.parse(fileContent);
      allPokemon = json;
      return allPokemon;
    }

    const api = new PokemonClient(); // create a PokemonClient
    let offset = 0;
    const LIMIT = 100;

    // 100件ずつ取得する
    while (true) {
      const pokemonList = await api.listPokemons(offset, LIMIT);
      allPokemon = allPokemon.concat(pokemonList.results);
      offset += LIMIT;
      if (pokemonList.results.length < LIMIT) {
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

  async function getPostsDB(name: PokemonDataBaseName) {
    let res;

    switch (name) {
      case "DexInfo":
        res = await prisma.dexINFO.findMany();
        break;
      case "TypeInfo":
        res = await prisma.typeINFO.findMany();
        break;
    }
    return res;
  }

  // 外部キー制約により順番を決める
  const FetchPokeAPI = async (): Promise<void> => {
    const api = new PokemonClient();
    
    console.log(``);
    console.log("--- Start ---");

    // ポケモン図鑑情報を取得
    if(fs.existsSync(JSON_POKEMON_DEX_PATH)) {
      const fileContent = fs.readFileSync(JSON_POKEMON_DEX_PATH , 'utf-8');
      const json: PokemonAPIObject[] = JSON.parse(fileContent);
      allDexInfo = json;
    } else {
      const dexInfo = await handlePokemon();
      fs.writeFileSync(JSON_POKEMON_DEX_PATH, JSON.stringify(dexInfo, null, 2));
      allDexInfo = dexInfo;
    }
    console.log("--- DexInfo Fin ---");


    // すでにファイルが存在する場合はjson読み込む
    if(fs.existsSync(JSON_POKEMON_INFO_PATH)){
      const fileContent = fs.readFileSync(JSON_POKEMON_INFO_PATH , 'utf-8');
      const json: Object[] = JSON.parse(fileContent);
      allPokemonInfo = json;
    } else {
      const PokemonList = await Promise.all(
        allDexInfo.map(async (data) => {
          const res = await fetch(data.url);
          return res.json();
        })
      );
      fs.writeFileSync(JSON_POKEMON_INFO_PATH, JSON.stringify(PokemonList, null, 2));
      allPokemonInfo = PokemonList;
    }
    console.log("--- PokemonList Fin ---");

    let SpecInfo:Object[] = [];
    // getParam: names.language.name , names.name

    if(fs.existsSync(JSON_POKEMON_SPEC_PATH)){
      const fileContent = fs.readFileSync(JSON_POKEMON_SPEC_PATH , 'utf-8');
      const json: Object[] = JSON.parse(fileContent);
      allSpecInfo = json;
    } else {
      const SpecInfo = await Promise.all(
        allPokemonInfo.map(async (data:any) => {
          const url = `https://pokeapi.co/api/v2/pokemon-species/${data.id}/`;
  
          try {
            const res = await fetch(url);
            if(res.status === 404) {
              throw new Error('404 Not Found');
            }
            return res.json();
          } catch (error) {
            // 404エラーが出た場合は 日本語名をAPIから取得不可
            return { id: data.id , names: null , name: data.name};
          }
        })
      );
      // 非同期処理完了後にファイルに書き込む
      fs.writeFileSync(JSON_POKEMON_SPEC_PATH, JSON.stringify(SpecInfo, null, 2));
      allSpecInfo = SpecInfo;
    }
    console.log("--- SpecInfo Fin ---");

    // タイプ情報を取得
    if(fs.existsSync(JSON_POKEMON_TYPE_PATH)) {
      const fileContent = fs.readFileSync(JSON_POKEMON_TYPE_PATH, 'utf-8');
      const json: PokemonAPIObject[] = JSON.parse(fileContent);
      allTypesInfo = json;
    } else {
      const TypeList = await handleTypes();
      fs.writeFileSync(JSON_POKEMON_TYPE_PATH, JSON.stringify(TypeList, null, 2));
      allTypesInfo = TypeList;
    }
    console.log("--- TypeList Fin ---");

    // 技情報を取得
    if(fs.existsSync(JSON_POKEMON_MOVE_PATH)) {
      const fileContent = fs.readFileSync(JSON_POKEMON_MOVE_PATH, 'utf-8');
      const json: PokemonAPIObject[] = JSON.parse(fileContent);
      allMoveInfo = json;
    } else {
      const MoveList = await handleMoves();
      fs.writeFileSync(JSON_POKEMON_MOVE_PATH, JSON.stringify(MoveList, null, 2));
      allMoveInfo = MoveList;
    }
    console.log("--- MoveList Fin ---");

    // アビリティ情報を取得
    if(fs.existsSync(JSON_POKEMON_ABILITY_PATH)) {
      const fileContent = fs.readFileSync(JSON_POKEMON_ABILITY_PATH, 'utf-8');
      const json: PokemonAPIObject[] = JSON.parse(fileContent);
      allAbilityInfo = json;
    } else {
      const AbilityList = await handleAbility();
      fs.writeFileSync(JSON_POKEMON_ABILITY_PATH, JSON.stringify(AbilityList, null, 2));
      allAbilityInfo = AbilityList;
    }
    console.log("--- AbilityList Fin ---");

    // アイテム情報を取得
    if(fs.existsSync(JSON_POKEMON_ITEM_PATH)) {
      const fileContent = fs.readFileSync(JSON_POKEMON_ITEM_PATH , 'utf-8');
      const json: PokemonAPIObject[] = JSON.parse(fileContent);
      allItemInfo = json;
    } else {
      const ItemList = await handleItem();
      fs.writeFileSync(JSON_POKEMON_ITEM_PATH, JSON.stringify(ItemList, null, 2));
      allItemInfo = ItemList;
    }
    console.log("--- ItemList Fin ---");

    // 性格情報を取得
    let NatureList: PokemonAPIObject[] = [];
    if(fs.existsSync(JSON_POKEMON_NATURE_PATH)) {
      const fileContent = fs.readFileSync(JSON_POKEMON_NATURE_PATH , 'utf-8');
      const json: PokemonAPIObject[] = JSON.parse(fileContent);
      allNatureInfo = json;
    } else {
      const NatureList = await handleNature();
      fs.writeFileSync(JSON_POKEMON_NATURE_PATH, JSON.stringify(NatureList, null, 2));
      allNatureInfo = NatureList;
    }
    console.log("--- NatureList Fin ---");

    
  }

  const InsertPokemonDexInfoDB = async ():Promise<void> => {
    let res = await getPostsDB("DexInfo");
    if(res && res?.length > 0) {
      console.log("--- DexInfo Already Inserted ---");
      return;
    }

    let insert_dex:any[] = [];
    allSpecInfo.forEach((data:any) => {
      let format = {};
     
      if(data.names === null) {
        format = {
          nationalDexAPI: data.id,
          nationalDex: data.id,
          nameJA: "",
          nameEN: data.name
        };
      
        insert_dex.push(format);
        return;
      }
     
      let Param_Name_JA = "";
      let Param_Name_EN = "";
      data.names.map((nameParam:any) => {
        switch (nameParam.language.name) {
          case "ja":
            Param_Name_JA = nameParam.name;
            break;
          case "en":
            Param_Name_EN = nameParam.name;
            break;
        }
      });
     
      format = {
        nationalDexAPI: data.id,
        nationalDex: data.id,
        nameJA: Param_Name_JA,
        nameEN: Param_Name_EN
      };
     
      insert_dex.push(format);
    });
     
    // まとめて挿入
    const results = await prisma.dexINFO.createMany({
      data: insert_dex
    });
    await prisma.$disconnect();
    console.log("--- DexInfo Inserted ---");
  };

  const InsertPokemonTypeInfoDB = async ():Promise<void> => {
    let res = await getPostsDB("TypeInfo");
    if(res && res?.length > 0) {
      console.log("--- TypeInfo Already Inserted ---");
      return;
    }

    let insert_type:any[] = [];
    allTypesInfo.forEach((data:any) => {
      // url からIDを取得(string -> number)
      let format = {
        typeID: parseInt(data.url.split("/")[6]),
        typeName: data.name
      };
      insert_type.push(format);
    });

    const results = await prisma.typeINFO.createMany({
      data: insert_type
    });
    await prisma.$disconnect();
    console.log("--- TypeInfo Inserted ---");

  };

  let promise_fetchPokemonAPI = FetchPokeAPI();
  Promise.all([promise_fetchPokemonAPI]).then(() => {
    console.log(``);
    InsertPokemonDexInfoDB();
    InsertPokemonTypeInfoDB();
  });

  return (
    <button>test</button>
  );
};

export default Access;