"use client";
import { PBaseProps, RequestPokemonData } from '@/types';
import React, {useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import { Create_PBaseProps, reducer_RequestPokemonData } from './reducer/P_Datas';

interface Props {
  dispatch_P_datas: React.Dispatch<any>
  P_datas?: PBaseProps[]
}

//TODO 個体値の算出方法を見破る
const HEX = {
  POKEMON: 8 * 2,
  GENDER: 34 * 2,
  EVS: 38 * 2,
  IVS: {
    HP: [138 * 2,140 * 2 , 330 * 2], // fb: 31 dc: 0
    ATK: [140 * 2,332 * 2], // 9b: 31 7d: 0 
    DEF: [141 * 2,334 * 2], // 9b: 31 7d: 0
    SPA: [142 * 2,338 * 2], // bb: 31 9c: 0
    SPD: [143 * 2,340 * 2], // a4: 31 86: 0
    SPE: [142 * 2,336 * 2], // 94: 31 75: 0
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
            const ivslist: any[] = [];
            for(let i = 0; i < 6; i++) {
              let val = null;
              let listindex;
              switch(i) {
                case 0:
                  listindex = HEX.IVS.HP.length - 1;
                  val = newHexString.substring(HEX.IVS.HP[listindex], HEX.IVS.HP[listindex] + 2);
                  val = parseInt(val, 16);
                  val -= HEX.IVS_MIN.HP;
                  val += HEX.IVS_OPTION.HP;
                  break;
                case 1:
                  listindex = HEX.IVS.ATK.length - 1;
                  val = newHexString.substring(HEX.IVS.ATK[listindex], HEX.IVS.ATK[listindex] + 2);
                  val = parseInt(val, 16);
                  val -= HEX.IVS_MIN.ATK;
                  val += HEX.IVS_OPTION.ATK;
                  break;
                case 2:
                  listindex = HEX.IVS.DEF.length - 1;
                  val = newHexString.substring(HEX.IVS.DEF[listindex], HEX.IVS.DEF[listindex] + 2);
                  val = parseInt(val, 16);
                  val -= HEX.IVS_MIN.DEF;
                  val += HEX.IVS_OPTION.DEF;
                  break;
                case 3:
                  listindex = HEX.IVS.SPA.length - 1;
                  val = newHexString.substring(HEX.IVS.SPA[listindex], HEX.IVS.SPA[listindex] + 2);
                  val = parseInt(val, 16);
                  val -= HEX.IVS_MIN.SPA;
                  val += HEX.IVS_OPTION.SPA;
                  break;
                case 4:
                  listindex = HEX.IVS.SPD.length - 1;
                  val = newHexString.substring(HEX.IVS.SPD[listindex], HEX.IVS.SPD[listindex] + 2);
                  val = parseInt(val, 16);
                  val -= HEX.IVS_MIN.SPD;
                  val += HEX.IVS_OPTION.SPD;
                  break;
                case 5:
                  listindex = HEX.IVS.SPE.length - 1;
                  val = newHexString.substring(HEX.IVS.SPE[listindex], HEX.IVS.SPE[listindex] + 2);
                  val = parseInt(val, 16);
                  val -= HEX.IVS_MIN.SPE;
                  val += HEX.IVS_OPTION.SPE;
                  break;
              }
              ivslist.push(val);
            }
            console.log(`IVs: ${ivslist}`);
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