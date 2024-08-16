"use server";
import prisma from "@/lib/prisma";
import { PokemonClient  , MoveClient } from 'pokenode-ts';
import { DataAbility, DataBaseStat , DataMoveObject, DataType, PokemonAPIObject, PokemonDataBase, PokemonDataBaseName, PokemonDataMoveLearnName, PokemonMoveLearnMethodObject, PokemonVersionGroupName } from '@/types';

import fs from 'fs';
import { Prisma } from "@prisma/client";
import { deleteAppClientCache } from "next/dist/server/lib/render-server";

const JSON_POKEMON_DEX_PATH = "./src/json/pokemonDex.json";
const JSON_POKEMON_INFO_PATH = "./src/json/pokemonInfo.json";
const JSON_POKEMON_SPEC_PATH = "./src/json/pokemonSpec.json";
const JSON_POKEMON_TYPE_PATH = "./src/json/pokemonType.json";
const JSON_POKEMON_MOVE_PATH = "./src/json/pokemonMove.json"; 
const JSON_POKEMON_ABILITY_PATH = "./src/json/pokemonAbility.json";
const JSON_POKEMON_ITEM_PATH = "./src/json/pokemonItem.json";
const JSON_POKEMON_NATURE_PATH = "./src/json/pokemonNature.json";

let DEBUG_FLAG = true;

export const Access = () => {
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
        res = await prisma.dexInfo.findMany();
        break;
      case "TypeInfo":
        res = await prisma.typeInfo.findMany();
        break;
      case "AbilityInfo":
        res = await prisma.abilityInfo.findMany();
        break;
      case "MoveInfo":
        res = await prisma.moveInfo.findMany();
        break;
      case "ItemInfo":
        res = await prisma.itemInfo.findMany();
        break;
      case "NatureInfo":
        res = await prisma.natureInfo.findMany();
        break;
      case "BaseInfo":
        res = await prisma.baseInfo.findMany();
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
    const results = await prisma.dexInfo.createMany({
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

    const results = await prisma.typeInfo.createMany({
      data: insert_type
    });
    await prisma.$disconnect();
    console.log("--- TypeInfo Inserted ---");

  };

  const InsertPokemonAbilityInfoDB = async ():Promise<void> => {
    let res = await getPostsDB("AbilityInfo");
    if(res && res?.length > 0) {
      console.log("--- AbilityInfo Already Inserted ---");
      return;
    }

    let insert_ability:any[] = [];
    allAbilityInfo.forEach((data:any) => {
      let format = {
        abilityID: parseInt(data.url.split("/")[6]),
        abilityName: data.name
      };
      insert_ability.push(format);
    });

    const results = await prisma.abilityInfo.createMany({
      data: insert_ability
    });
    await prisma.$disconnect();
    console.log("--- AbilityInfo Inserted ---");
  };

  const InsertPokemonMoveInfoDB = async ():Promise<void> => {
    let res = await getPostsDB("MoveInfo");
    if(res && res?.length > 0) {
      console.log("--- MoveInfo Already Inserted ---");
      return;
    }

    let insert_move:any[] = [];
    allMoveInfo.forEach((data:any) => {
      let format = {
        moveID: parseInt(data.url.split("/")[6]),
        moveName: data.name
      };
      insert_move.push(format);
    });

    const results = await prisma.moveInfo.createMany({
      data: insert_move
    });
    await prisma.$disconnect();
    console.log("--- MoveInfo Inserted ---");
  };

  const InsertPokemonItemInfoDB = async ():Promise<void> => {
    let res = await getPostsDB("ItemInfo");
    if(res && res?.length > 0) {
      console.log("--- ItemInfo Already Inserted ---");
      return;
    }

    let insert_item:any[] = [];
    allItemInfo.forEach((data:any) => {
      let format = {
        itemID: parseInt(data.url.split("/")[6]),
        itemName: data.name
      };
      insert_item.push(format);
    });

    // 重複しているアイテム名があるため、skipDuplicatesをtrueにする
    const results = await prisma.itemInfo.createMany({
      data: insert_item,
      skipDuplicates: true
    });
    await prisma.$disconnect();
    console.log("--- ItemInfo Inserted ---");
  };

  const InsertPokemonNatureInfoDB = async ():Promise<void> => {
    let res = await getPostsDB("NatureInfo");
    if(res && res?.length > 0) {
      console.log("--- NatureInfo Already Inserted ---");
      return;
    }

    let insert_nature:any[] = [];
    allNatureInfo.forEach((data:any) => {
      let format = {
        natureID: parseInt(data.url.split("/")[6]),
        natureName: data.name
      };
      insert_nature.push(format);
    });

    const results = await prisma.natureInfo.createMany({
      data: insert_nature
    });
    await prisma.$disconnect();
    console.log("--- NatureInfo Inserted ---");
  };

  // タイプ情報の挿入
  const InsertPokemonDataFormatCreate_Types = async (types: DataType[] , format: PokemonDataBase):Promise<void> => {
    Promise.all(types.map(async (values) => {
      try {
        let res_type = null;
        res_type = await prisma.typeInfo.findFirst({
          where: {
            typeName: values.type.name
          }
        });

        if(res_type) {
          switch(values.slot) {
            case 1:
              format.type1 = res_type.typeID;
              break;
            case 2:
              format.type2 = res_type.typeID;
              break;
          }
        }
      } catch (error) {
        console.error("Error processing types:", error);
      }
    }));
  };

  const InsertPokemonDataFormatCreate_Ability = async (ability: DataAbility[] , format: PokemonDataBase):Promise<void> => {
    Promise.all(ability.map(async (values) => {
      try {
        let res_ability = null;
        res_ability = await prisma.abilityInfo.findFirst({
          where: {
            abilityName: values.ability.name
          }
        });

        if(res_ability) {
          switch(values.slot) {
            case 1:
              format.ability1 = res_ability.abilityID;
              break;
            case 2:
              format.ability2 = res_ability.abilityID;
              break;
            case 3:
              format.ability3 = res_ability.abilityID;
              break;
          }
        }
        
        if(format.ability2 === 0) {
          format.ability2 = null;
        }
      } catch (error) {
        console.error("Error processing ability:", error);
      }
    }));
  };

  const InsertPokemonDataFormatCreate_Status = async (status: DataBaseStat[] , format: PokemonDataBase):Promise<void> => {
    Promise.all(status.map(async (values) => {
      try {
        switch(values.stat.name) {
          case "hp":
            format.basestatus.hp = values.base_stat;
            break;
          case "attack":
            format.basestatus.attack = values.base_stat;
            break;
          case "defense":
            format.basestatus.defense = values.base_stat;
            break;
          case "special-attack":
            format.basestatus.spattack = values.base_stat;
            break;
          case "special-defense":
            format.basestatus.spdefense = values.base_stat;
            break;
          case "speed":
            format.basestatus.speed = values.base_stat;
            break;
        }
      } catch (error) {
        console.error("Error processing status:", error);
      }
    }));
  }; // Func End

  const InsertPokemonDataFormatCreate_Moves = async (moves: DataMoveObject[] , format: PokemonDataBase):Promise<void> => {
    Promise.all(moves.map(async (values) => {
      let moveFormat: DataMoveObject = {
        move: {
          name: "",
          url: ""
        },
        version_group_details: []
      };
    
      moveFormat.move.name = values.move.name;
      moveFormat.move.url = values.move.url;

      let learnList = values.version_group_details.filter((val:any) => {
        let versionGroup: PokemonVersionGroupName = val.version_group.name;
        return versionGroup === "scarlet-violet";
      });
      
      if(learnList.length === 0) return false;
      moveFormat.version_group_details = learnList;
      return moveFormat;
    
    })).then(async (res) => {
      if(res.length === 0) return res;

      res.forEach((values:any) => {
        // 覚えるわざがない場合はスキップ
        if(values === false) return;
    
        let version_group_details = values.version_group_details;

        let push_data = {
          move: {
            name: values.move.name,
            url: values.move.url
          },
          version_group_details: values.version_group_details,
        };
        format.moves.push(push_data);
      });

      const learnMethodOrder = {
        'level-up': 1,
        'machine': 2,
        'tutor': 3,
        'egg': 4
      };
      
      // 習得方法順を先にソート
      format.moves.forEach((values) => {
        values.version_group_details.sort((a,b) => {
          let a_learn:PokemonDataMoveLearnName = a.move_learn_method.name;
          let b_learn:PokemonDataMoveLearnName = b.move_learn_method.name;
          return learnMethodOrder[a_learn] - learnMethodOrder[b_learn];
        });
      });

      // MoveID 昇順
      format.moves.sort((a,b) => {
        // Move ID 昇順
        if(parseInt(a.move.url.split("/")[6]) !== parseInt(b.move.url.split("/")[6])) {
          return parseInt(a.move.url.split("/")[6]) - parseInt(b.move.url.split("/")[6]);
        }
        return 0;
      });

      //* データ確認
      // format.moves.forEach((values) => {
      //   let moveID = parseInt(values.move.url.split("/")[6]);
      //   let moveName = values.move.name
      //   values.version_group_details.forEach((val) => {
      //     let level = val.level_learned_at;
      //     let version = val.version_group.name;
      //     let move_learn_method = val.move_learn_method.name;
      //     console.log(`MoveID: ${moveID} , MoveName: ${moveName} , Level: ${level} , Version: ${version} , LearnMethod: ${move_learn_method}`);
      //   });
      // });
    }).catch((error) => {
      console.error("Error processing moves:", error);
    }); // Promise All End
  }; // Func End

  const InsertPokemonDataFormatCreate_BaseInfo = async (promises: Promise<void>[] , format:PokemonDataBase , dexNum: number):Promise<void> => {

    const _dexinfo = await prisma.dexInfo.findFirst({
      where: {
        nationalDexAPI: dexNum
      }
    });

    const Insert_BaseInfo = async (dexNum: number):Promise<void> => {
      let _type1 = format.type1 as number;
      let _type2 = format.type2 as number;
      let _ability1 = format.ability1 as number;
      let _ability2 = format.ability2 as number;
      let _ability3 = format.ability3 as number;
      let _hp = format.basestatus.hp as number;
      let _attack = format.basestatus.attack as number;
      let _defense = format.basestatus.defense as number;
      let _spattack = format.basestatus.spattack as number;
      let _spdefense = format.basestatus.spdefense as number;
      let _speed = format.basestatus.speed as number;

      // 挿入
      try {
        const data: any = {
          basenationalDexAPI: dexNum,
          type1: _type1,
          type2: _type2,
          ability1: _ability1,
          ability2: _ability2,
          ability3: _ability3,
          baseHP: _hp,
          baseAttack: _attack,
          baseDefense: _defense,
          baseSpAttack: _spattack,
          baseSpDefense: _spdefense,
          baseSpeed: _speed,
        };

        if (_dexinfo?.nationalDexAPI !== undefined) {
          data.dexInfo = {
            connect: {
              nationalDexAPI: _dexinfo.nationalDexAPI,
            },
          };
        }

        const result = await prisma.baseInfo.create({
          data: data,
        });
        
      } catch (error) {
        if (error instanceof Prisma.PrismaClientValidationError) {
          console.error("Validation Error:", error.message);
        } else {
          console.error("Error creating baseInfo:", error);
        }
      } finally {
        await prisma.$disconnect();
      }
    };

    const Insert_MoveLearnList = async ():Promise<void> => {

      try {
        let moveInputs:any = [];
        format.moves.forEach(async (values) => {
          const moveData = {
            movenationalDexAPI: _dexinfo?.nationalDexAPI,
            moveID: parseInt(values.move.url.split("/")[6]),
            moveLevel: values.version_group_details[0].level_learned_at,
            moveVersion: values.version_group_details[0].version_group.name,
          };
          moveInputs.push(moveData);
        });

        await prisma.moveLearnList.createMany({
          data: moveInputs,
        });

      } catch (error) {
        console.error("Error creating moveLearnList:", error);
      } finally {
        await prisma.$disconnect();
      }
    }; // Func End

    // メイン処理
    Promise.all(promises).then(async (res) => {
      // 基本情報の挿入
      await Insert_BaseInfo(dexNum);
      // わざ情報を挿入
      await Insert_MoveLearnList();

    }); // Promise All End
  }; // Func End

  const InsertPokemonDataFormatCreate_Main = async (dexNum: number):Promise<void> => {
    let _allPokemonInfo:any = [...allPokemonInfo];
    let format: PokemonDataBase = {
      nationalDexAPI: dexNum,
      type1: 0,
      type2: 0,
      ability1: 0,
      ability2 : 0,
      ability3: 0,
      basestatus: {
        hp: 0,
        attack: 0,
        defense: 0,
        spattack: 0,
        spdefense: 0,
        speed: 0
      },
      moves: []
    };
    let types: DataType[];
    let ability: DataAbility[];
    let status: DataBaseStat[];
    let moves: DataMoveObject[];
    types = _allPokemonInfo[dexNum - 1]["types"];
    ability = _allPokemonInfo[dexNum - 1]["abilities"];
    status = _allPokemonInfo[dexNum - 1]["stats"];
    moves = _allPokemonInfo[dexNum - 1]["moves"];

    // 各データを挿入
    let promises = [
      InsertPokemonDataFormatCreate_Types(types , format),
      InsertPokemonDataFormatCreate_Ability(ability , format),
      InsertPokemonDataFormatCreate_Status(status , format),
      InsertPokemonDataFormatCreate_Moves(moves , format),
    ];
    await InsertPokemonDataFormatCreate_BaseInfo(promises , format , dexNum);
  };  // Func End

  const InsertPokemonBaseInfoDB = async ():Promise<void> => { 
    let res = await getPostsDB("BaseInfo");
    if(res && res?.length > 0) {
      console.log("--- BaseInfo Already Inserted ---");
      return;
    }

    let resDex = await getPostsDB("DexInfo");
    if(!resDex) {
      console.log("--- DexInfo is Empty ---");
      return;
    }

    //非同期処理もあるため map を利用
    resDex.map(async (data:any) => {
      let dexNum = data.nationalDexAPI;
      
      // IDの指定可能
      if(dexNum === 1) {
        await InsertPokemonDataFormatCreate_Main(dexNum);
      }
    });
    // 関数外
    console.log("--- BaseInfo Inserted ---");
    
  }; // Func End



  
  //* Main Process
  let promise_fetchPokemonAPI = FetchPokeAPI();
  Promise.all([promise_fetchPokemonAPI]).then(() => {
    console.log(``);
    let promises = [
      InsertPokemonDexInfoDB(),
      InsertPokemonTypeInfoDB(),
      InsertPokemonAbilityInfoDB(),
      InsertPokemonMoveInfoDB(),
      InsertPokemonItemInfoDB(),
      InsertPokemonNatureInfoDB()
    ];

    // 上記処理してからBaseInfoを挿入する
    Promise.all(promises).then(async () => {
      console.log(``);

      if(DEBUG_FLAG) {
        await prisma.baseInfo.deleteMany({});
        await prisma.moveLearnList.deleteMany({});
      }
      InsertPokemonBaseInfoDB();
    });
  });

  return (
    <button>test</button>
  );
};

export default Access;