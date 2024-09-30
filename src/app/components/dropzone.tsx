"use client";
import { PBaseProps, RequestPokemonData } from '@/types';
import React, {useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import { Create_PBaseProps, reducer_RequestPokemonData } from './reducer/P_Datas';

interface Props {
  dispatch_P_datas: React.Dispatch<any>
  P_datas?: PBaseProps[]
}

// HP
// 44:  68
// 45:  69
// 58:  76
// 59:  77
// 60:  78
// 78:  8a
// 80:  8c

// HP以外
// 80:  55
// 82:  57
// 83:  58
// 100: 69

//HP分だけアドレスがずれる？
//       6 * 2   , 138 * 2 ,  140 * 2
// 001: [fe ac,69 00,00 00 00 00]
// 002: [0e 2d,78 00,00 00 00 80] 
// 003: [23 2d,8c 00,00 00 00 80] +21 +20
// 004: [37 2d,63 00,00 00 00 80] +20 -41
// 005: [4b 2d,76 00,00 00 00 80]
// 006: [60 2d,8a 00,00 00 00 80]
// 007: [0d 2d,68 00,00 00 00 80]
// 008: [1d 2d,77 00,00 00 00 80]
// 009: [32 2d,8b 00,00 00 00 80]

// normal: 00: [80 00,00 00,null]
  // OFFSET: 138*2(4) は 330*2(4) に依存している？
  // 00: [00 00]
  // 01: [ae 00]
  // 02: [af 00]
  // 03: [af 00]
  // 04: [b0 00]
  // 05: [b0 00]
  // 06: [b1 00]
  // 07: [b1 00]
  // 08: [b2 00]
  // 09: [b2 00]
  // 0a: [b3 00]
  // 0b: [b3 00]
  // 0c: [b4 00]
  // 0d: [b4 00]
  // 0e: [b5 00]
  // 0f: [b5 00]

//モロバレル Lv.50
  // HP: [6*2(4),140*2(8),330*2(4)]
  // 00: [80 80,00 00 00 00,ae 00]
  // 01: [81 80,01 00 00 00,ae 00]
  // 02: [83 80,02 00 00 00,af 00]
  // 03: [84 80,03 00 00 00,af 00]
  // 04: [86 80,04 00 00 00,b0 00]
  // 05: [87 80,05 00 00 00,b0 00]
  // 06: [89 80,06 00 00 00,b1 00] 
  // 07: [8a 80,07 00 00 00,b1 00]
  // 08: [8c 80,08 00 00 00,b2 00]
  // 09: [8d 80,09 00 00 00,b2 00]
  // 0a: [8f 80,0a 00 00 00,b3 00]
  // 0b: [90 80,0b 00 00 00,b3 00]
  // 0c: [92 80,0c 00 00 00,b4 00]
  // 0d: [93 80,0d 00 00 00,b4 00]
  // 0e: [95 80,0e 00 00 00,b5 00]
  // 0f: [96 80,0f 00 00 00,b5 00]

  // ATK:[6*2(4),140*2(8),332*2(4)]
  // 00: [80 80,00 00 00 00,5a 00]
  // 01: [a0 00,20 00 00 00,5a 00]
  // 02: [c0 00,40 00 00 00,5b 00]
  // 03: [e0 00,60 00 00 00,5b 00]
  // 04: [00 81,80 00 00 00,5c 00]
  // 05: [20 81,a0 00 00 00,5c 00]
  // 06: [40 81,c0 00 00 00,5d 00]
  // 07: [60 81,e0 00 00 00,5d 00]
  // 08: [80 81,00 01 00 00,5e 00]
  // 09: [a0 81,20 01 00 00,5e 00]
  // 0a: [c0 81,40 01 00 00,5f 00]
  // 0b: [e0 81,60 01 00 00,5f 00]
  // 0c: [00 82,80 01 00 00,60 00]
  // 0d: [20 82,a0 01 00 00,60 00]
  // 0e: [40 82,c0 01 00 00,61 00]
  // 0f: [60 82,e0 01 00 00,61 00]

  // DEF:[6*2(4),140*2(8),334*2(4)]
  // 00: [80 80,00 00 00 00,43 00]
  // 01: [80 84,00 04 00 00,43 00]
  // 02: [80 88,00 08 00 00,44 00]
  // 03: [80 8c,00 0c 00 00,44 00]
  // 04: [80 90,00 10 00 00,45 00]
  // 05: [80 94,00 14 00 00,45 00]
  // 06: [80 98,00 18 00 00,46 00]
  // 07: [80 9c,00 1c 00 00,46 00]
  // 08: [80 a0,00 20 00 00,47 00]
  // 09: [80 a4,00 24 00 00,47 00]
  // 0a: [80 a8,00 28 00 00,48 00]
  // 0b: [80 ac,00 2c 00 00,48 00]
  // 0c: [80 b0,00 30 00 00,48 00]
  // 0d: [80 b4,00 34 00 00,48 00]
  // 0e: [80 b8,00 38 00 00,49 00]
  // 0f: [80 bc,00 3c 00 00,49 00]

  // SPA:[6*2(4),140*2(8),338*2(4)]
  // 00: [80 80,00 00 00 00,5a 00]
  // 01: [90 80,00 00 10 00,5a 00]
  // 02: [a0 80,00 00 20 00,5b 00]
  // 03: [b0 80,00 00 30 00,5b 00]
  // 04: [c0 80,00 00 40 00,5c 00]
  // 05: [d0 80,00 00 50 00,5c 00]
  // 06: [e0 80,00 00 60 00,5d 00]
  // 07: [f0 80,00 00 70 00,5d 00]
  // 08: [00 81,00 00 80 00,5e 00]
  // 09: [10 81,00 00 90 00,5e 00]
  // 0a: [20 81,00 00 a0 00,5f 00]
  // 0b: [30 81,00 00 b0 00,5f 00]
  // 0c: [40 81,00 00 c0 00,60 00]
  // 0d: [50 81,00 00 d0 00,60 00]
  // 0e: [60 81,00 00 e0 00,61 00]
  // 0f: [70 81,00 00 f0 00,61 00]

  // SPD:[6*2(4),140*2(8),340*2(4)]
  // 00: [80 80,00 00 00 00,5d 00]
  // 01: [80 82,00 00 00 02,5d 00]
  // 02: [80 84,00 00 00 04,5e 00]
  // 03: [80 86,00 00 00 06,5e 00]
  // 04: [80 88,00 00 00 08,5f 00]
  // 05: [80 8a,00 00 00 0a,5f 00]
  // 06: [80 8c,00 00 00 0c,60 00]
  // 07: [80 8e,00 00 00 0e,60 00]
  // 08: [80 90,00 00 00 10,61 00]
  // 09: [80 92,00 00 00 12,61 00]
  // 0a: [80 94,00 00 00 14,63 00]
  // 0b: [80 96,00 00 00 16,63 00]
  // 0c: [80 98,00 00 00 18,64 00]
  // 0d: [80 9a,00 00 00 1a,64 00]
  // 0e: [80 9c,00 00 00 1c,65 00]
  // 0f: [80 9e,00 00 00 1e,65 00]

  // SPE:[6*2(4),140*2(8),336*2(4)]
  // 00: [80 80,00 00 00 00,23 00]
  // 01: [80 00,00 80 00 00,23 00]
  // 02: [81 80,00 00 01 00,24 00]
  // 03: [81 00,00 80 01 00,24 00]
  // 04: [82 80,00 00 02 00,25 00]
  // 05: [82 00,00 80 02 00,25 00]
  // 06: [83 80,00 00 03 00,26 00]
  // 07: [83 00,00 80 03 00,26 00]
  // 08: [84 80,00 00 04 00,27 00]
  // 09: [84 00,00 80 04 00,27 00]
  // 0a: [85 80,00 00 05 00,28 00]
  // 0b: [85 00,00 80 05 00,28 00]
  // 0c: [86 80,00 00 06 00,29 00]
  // 0d: [86 00,00 80 06 00,29 00]
  // 0e: [87 80,00 00 07 00,2a 00]
  // 0f: [87 00,00 80 07 00,2a 00]

//フシギソウ Lv.100
//TODO 実数値で値が変化しているか確認 フシギソウでやる

const HEX = {
  POKEMON: 8 * 2,
  GENDER: 34 * 2,
  EVS: 38 * 2,
  IVS: {
    OFFSET: 138 * 2,
    COMMON_FIRST: 6 * 2,
    COMMON_SECOND: 138 * 2,
    HP:  330 * 2,
    ATK: 332 * 2, 
    DEF: 334 * 2,
    SPA: 338 * 2,
    SPD: 340 * 2,
    SPE: 336 * 2,
  },
  IVS_MIN: {
    HP: parseInt("dc", 16),
    ATK: parseInt("7d", 16),
    DEF: parseInt("7d", 16),
    SPA: parseInt("9c", 16),
    SPD: parseInt("86", 16),
    SPE: parseInt("75", 16),
  },
  // 謎の加算値があるので、それを引く
  IVS_OPTION: {
    HP: 0,
    ATK: 1,
    DEF: 1,
    SPA: 0,
    SPD: 1,
    SPE: 0
  },
  LEVEL: 328 * 2,
  ITEM: 10 * 2,
  ABILITY: 20 * 2,
  ABILITY_NUM: 22 * 2,
  NATURE: 32 * 2,
  MOVE: 114 * 2,
  TERATYPE: 148 * 2,
}

const MyDropzone:React.FC<Props> = ({dispatch_P_datas , P_datas}) => {
  const [hexStrings , setHexStrings ] = useState<string[]>([]);
  const [requestpokemonData , setrequestPokemonData] = useState<RequestPokemonData[]>([]);
  const [fetchData , setFetchData] = useState<any>(null);
  
  // pokemonData が変更されたら、fetchData を実行
  useEffect(() => {
    if(requestpokemonData.length === 0) return;

    console.log("useEffect called");
    const fetchData = async () => {
      const newFetchDataList = await Promise.all(requestpokemonData.map(async (data) => {
        const res:any = await reducer_RequestPokemonData({type: "FILE", payload: data});
        return res;
      }));
      setFetchData(newFetchDataList);
      console.log(newFetchDataList);

      newFetchDataList.forEach((res) => {
        let newPBase = Create_PBaseProps("FETCH", res);        // 追加
        dispatch_P_datas({ type: "ADD", payload: newPBase });
      });
      // 追加データをリセットする
      setrequestPokemonData([]);

      setFetchData(null);
      console.log("useEffect fin");
    };

    fetchData();
  },[requestpokemonData]);

  //TODO 性別、個体値、努力値、レベルの取得
  const onDrop = (acceptedFiles: File[]) => {
    console.log("onDrop called");
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryString = event.target?.result as ArrayBuffer;
        if (binaryString) {
          const newHexString = Array.from(new Uint8Array(binaryString)).map(byte => byte.toString(16).padStart(2, '0')).join('');
          setHexStrings([...hexStrings, newHexString]);
  
          let f_id:number;
          let f_gender:number;
          let f_level:number;
          let f_move1:number;
          let f_move2:number;
          let f_move3:number;
          let f_move4:number;
          let f_ability:number;
          let f_item:number;
          let f_natureCurrent:number;
          let f_teraTypeCurrent:number;
          
          {
            // Pokemon
            const pokemon = newHexString.substring(HEX.POKEMON , HEX.POKEMON + 4);
            // バイトオーダーを逆にする
            const pokemonDec = pokemon.substring(2, 4) + pokemon.substring(0, 2);
            // 16進数を10進数に変換
            const decimalValue = parseInt(pokemonDec, 16);
            console.log(`Pokemon: ${decimalValue}`);
            f_id = decimalValue;
          }

          {
            // Gender
            const gender = newHexString.substring(HEX.GENDER , HEX.GENDER + 2);
            const decimalValue = parseInt(gender, 16);
            f_gender = decimalValue;
            // 0: ♂ 2: ♀
            console.log(`Gender: ${decimalValue}`);
          }

          {
            // Evs
            const evslist: number[] = [];
            for(let i = 0; i < 6; i++) {
              const ev = newHexString.substring(HEX.EVS + (i * 2) , HEX.EVS + (i * 2) + 2);
              const decimalValue = parseInt(ev, 16);
              evslist.push(decimalValue);
            }
            console.log(`EVs: ${evslist}`);
          }

          {
            // IVs
            const ivslist: any = {
              HP: null,
              ATK: null,
              DEF: null,
              SPA: null,
              SPD: null,
              SPE: null,
            };
            // 4byte
            let common1 = newHexString.substring(HEX.IVS.COMMON_FIRST , HEX.IVS.COMMON_FIRST + 4);
            let decCommon1 = parseInt(common1, 16);
            // 基準値を ♂と統一
            decCommon1 = decCommon1 - f_gender;
            // result
            common1 = decCommon1.toString(16);
            
            // 8byte
            const common2 = newHexString.substring(HEX.IVS.COMMON_SECOND , HEX.IVS.COMMON_SECOND + 8);
            const hp = newHexString.substring(HEX.IVS.HP , HEX.IVS.HP + 4);
            const atk = newHexString.substring(HEX.IVS.ATK , HEX.IVS.ATK + 4);
            const def = newHexString.substring(HEX.IVS.DEF , HEX.IVS.DEF + 4);
            const spa = newHexString.substring(HEX.IVS.SPA , HEX.IVS.SPA + 4);
            const spd = newHexString.substring(HEX.IVS.SPD , HEX.IVS.SPD + 4);
            const spe = newHexString.substring(HEX.IVS.SPE , HEX.IVS.SPE + 4);

            ivslist.HP  = hp;  
            ivslist.ATK = atk;
            ivslist.DEF = def;
            ivslist.SPA = spa;
            ivslist.SPD = spd;
            ivslist.SPE = spe;
            console.log(`IVs Common: ${common1} , ${common2}`);
            console.log(`IVs: ${hp} , ${atk} , ${def} , ${spa} , ${spd} , ${spe}`);
          }

          {
            // Level
            const level = newHexString.substring(HEX.LEVEL , HEX.LEVEL + 2);
            const decimalValue = parseInt(level, 16);
            console.log(`Level: ${decimalValue}`);
            f_level = decimalValue;
          }
  
          {
            // Item
            const item = newHexString.substring(HEX.ITEM , HEX.ITEM + 4);
            // バイトオーダーを逆にする
            const itemDec = item.substring(2, 4) + item.substring(0, 2);
            // 16進数を10進数に変換
            const decimalValue = parseInt(itemDec, 16);
            console.log(`Item: ${decimalValue}`);
            f_item = decimalValue;
          }
  
          // ability
          const abilityList: number[] = [];
          {
            const ability = newHexString.substring(HEX.ABILITY , HEX.ABILITY + 4);
            // バイトオーダーを逆にする
            const abilityDec = ability.substring(2, 4) + ability.substring(0, 2);
            // 16進数を10進数に変換
            const decimalValue = parseInt(abilityDec, 16);
            abilityList.push(decimalValue);
    
            // 何番目の特性かどうか？
            const abilityNum = newHexString.substring(HEX.ABILITY_NUM , HEX.ABILITY_NUM + 2);
            const decimalValueNum = parseInt(abilityNum, 16);
            // 1: SET1  2: SET2  4: SET3
            abilityList.push(decimalValueNum);
          }
          console.log(`Ability: ${abilityList}`);
          f_ability = abilityList[0];
  
          // nature
          const natureList: number[] = [];
          for(let i = 0; i < 2; i++) {
            const nature = newHexString.substring(HEX.NATURE + (i * 2) ,HEX.NATURE + (i * 2) + 2);
            const decimalValue = parseInt(nature , 16);
            natureList.push(decimalValue);
          }
          console.log(`Nature: ${natureList}`);
          f_natureCurrent = natureList[1];
  
          // move
          const list: number[] = [];
          for (let i = 0; i < 4; i++) {
            const move = newHexString.substring(HEX.MOVE + (i * 4), HEX.MOVE + (i * 4) + 4);
            const reversedMove = move.substring(2, 4) + move.substring(0, 2); // バイトオーダーを逆にする
            const decimalValue = parseInt(reversedMove, 16); // 16進数を10進数に変換
            list.push(decimalValue);
          }
          console.log(`Move: ${list}`);
          f_move1 = list[0];
          f_move2 = list[1];
          f_move3 = list[2];
          f_move4 = list[3];
  
          // teratype
          const teratypes: number[] = [];
          {
            for (let i = 0; i < 2; i++) {
              const tetatype = newHexString.substring(HEX.TERATYPE + (i * 2), HEX.TERATYPE  + (i * 2) + 2);
              const decimalValue = parseInt(tetatype, 16); // 16進数を10進数に変換
              teratypes.push(decimalValue);
            }
          }
          // 99: stera  Base , Edit
          console.log(`Teratype Base: ${teratypes[0]} , Edit: ${teratypes[1]}`);
          f_teraTypeCurrent = teratypes[1];
  
          const request: RequestPokemonData = {
            nationalAPI: f_id,
            move1: f_move1,
            move2: f_move2,
            move3: f_move3,
            move4: f_move4,
            ability: f_ability,
            item: f_item,
            natureCurrent: f_natureCurrent,
            teraTypeCurrent: f_teraTypeCurrent,
          };
          setrequestPokemonData((prevlist) => [...prevlist , request]);
        } // if (binaryString)
      } // onload
      reader.readAsArrayBuffer(file);
    });
  };

  const {getRootProps , getInputProps } = useDropzone({onDrop});

  return (
    <>
      <div {...getRootProps()} className='border my-20 h-[4rem] text-center'>
        <input {...getInputProps()} />
        <p className='text-center translate-y-1/2'>ファイルをここにドロップするか、クリックして選択してください</p>
      </div>
      <ul>
        {requestpokemonData && Object.entries(requestpokemonData).map(([key, value]) => (
          <li key={key}>{key}: {}</li>
        ))}
      </ul>
      {hexStrings.map((hexString, index) => (
        <p key={index}>{hexString}</p>
      ))}
    </>
  );
}

export default MyDropzone;