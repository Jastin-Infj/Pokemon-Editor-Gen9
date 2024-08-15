"use server";
import prisma from "@/lib/prisma";
import { PokemonClient  , MoveClient } from 'pokenode-ts';
import { DataAbility, DataBaseStat , DataMoveObject, DataType, PokemonAPIObject, PokemonDataBase, PokemonDataBaseName, PokemonVersionGroupName } from '@/types';

import fs from 'fs';
import { Prisma } from "@prisma/client";

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

    let _allPokemonInfo:any = [...allPokemonInfo];

    // 加工準備
    let insert_base:any[] = [];

    //非同期処理もあるため map を利用
    resDex.map(async (data:any) => {
      let format: PokemonDataBase = {
        nationalDexAPI: data.nationalDexAPI,
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

      if(data.nationalDexAPI === 1) {
        console.log("成功");
        let types: DataType[];
        let ability: DataAbility[];
        let status: DataBaseStat[];
        let moves: DataMoveObject[];

        types = _allPokemonInfo[0]["types"];
        ability = _allPokemonInfo[0]["abilities"];
        status = _allPokemonInfo[0]["stats"];
        moves = _allPokemonInfo[0]["moves"];

        let types_promise = Promise.all(types.map(async (values) => {
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

        let ability_promise = Promise.all(ability.map(async (values) => {
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

        let status_promise = Promise.all(status.map(async (values) => {
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

        let moves_promise = Promise.all(moves.map(async (values) => {
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
            format.moves.push({
              move: {
                name: values.move.name,
                url: values.move.url
              },
              version_group_details: version_group_details
            });
          });
        }).catch((error) => {
          console.error("Error processing moves:", error);
        });

        Promise.all([types_promise , ability_promise , status_promise , moves_promise]).then(async (res) => {
          // console.log(data.nationalDexAPI);
          // console.log(parseInt(format.moves[0].move.url.split("/")[6]));
          // console.log(parseInt(format.moves[0].version_group_details[0].level_learned_at));
          // console.log(format.moves[0].version_group_details[0].version_group.name);

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

          const _dexinfo = await prisma.dexInfo.findFirst({
            where: {
              nationalDexAPI: data.nationalDexAPI
            }
          });

          // 挿入
          try {
            const data: any = {
              basenationalDexAPI: 1,
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
          
          
          // 後でわざリストを挿入する
          // await prisma.moveLearnList.createMany({
          //   data: {
          //     nationalDexAPI: data.nationalDexAPI,
          //     moveID: parseInt(format.moves[0].move.url.split("/")[6]),
          //     moveLevel: parseInt(format.moves[0].version_group_details[0].level_learned_at),
          //     moveVersion: format.moves[0].version_group_details[0].version_group.name,
          //   }
          // });

          console.log("--- Fin ---");
        });

      }

      // insert_base.push(format);
    });
    console.log("--- BaseInfo Inserted ---");
    // let insert_base:any[] = [];
    // allPokemonInfo.forEach((data:any) => {
      
    // });
  };

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
    Promise.all(promises).then(() => {
      console.log(``);
      InsertPokemonBaseInfoDB();
    });
  });

  return (
    <button>test</button>
  );
};

export default Access;