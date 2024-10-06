"use client";
import { BaseStatus, GenderType, PBaseProps, RequestPokemonData } from '@/types';
import React, {useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import { Create_PBaseProps, reducer_RequestPokemonData } from './reducer/P_Datas';
import { CommonMyFunc } from './common/func';
import CMF = CommonMyFunc;

interface Props {
  dispatch_P_datas: React.Dispatch<any>
  P_datas?: PBaseProps[]
}

//フシギソウ Lv.100
//TODO 実数値で値が変化しているか確認 フシギソウでやる
// 実数値

// 16進数と一致
// 7d: 125
// 81: 129
// 83: 131
// a5: 165

// 個体値 140 * 8 右側にいけばいくほど値が上がるため リトルエンディアン
// All 0:  0x00 00 00 00
// +HP  1: 0x01 00 00 00
// +ATK 1: 0x20 00 00 00
// +DEF 1: 0x00 04 00 00
// +SPA 1: 0x00 00 10 00
   //      0x00 00 00 01
// +SPD 1: 0x00 00 00 02
// +SPE 1: 0x00 80 00 00


const HEX = {
  POKEMON: 8 * 2,
  GENDER: 34 * 2,
  EVS: 38 * 2,
  IVS: {
    OFFSET: 140 * 2,
    OPTOINS_MEMO: {
      HP:  0x00000001,
      ATK: 0x00000020,
      DEF: 0x00000400,
      SPA: 0x00100000,
      SPD: 0x02000000,
      SPE: 0x00800000,
    },
    OPTION: {
      // 最下位ビットを取得するため最大値をあてる
      HP:  0x0000001F,  // 5 bits for HP
      ATK: 0x000003E0,  // 5 bits for ATK
      DEF: 0x00007C00,  // 5 bits for DEF
      SPA: 0x01F00000,  // 5 bits for SPA
      SPD: 0x3E000000,  // 5 bits for SPD
      SPE: 0x000F8000,  // 5 bits for SPE
    }
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
        let optionData = {
          level: data.level,
          gender: data.gender,
          ivs: data.ivs,
          evs: data.evs
        };
        res.push(optionData);
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
          let f_gender:GenderType;
          let f_level:number;
          let f_move1:number;
          let f_move2:number;
          let f_move3:number;
          let f_move4:number;
          let f_ability:number;
          let f_item:number;
          let f_natureCurrent:number;
          let f_teraTypeCurrent:number;
          let f_ivs:BaseStatus;
          let f_evs:BaseStatus;
          
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
            switch(decimalValue) {
              case 0:
                f_gender = "♂";
                break;
              case 2:
                f_gender = "♀";
                break;
              default:
                f_gender = "none";
                break;
            }
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

            f_evs = {
              hp: evslist[0],
              attack: evslist[1],
              defense: evslist[2],
              spattack: evslist[3],
              spdefense: evslist[4],
              speed: evslist[5]
            }
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
            // 8byte
            let common1 = newHexString.substring(HEX.IVS.OFFSET , HEX.IVS.OFFSET + 8);
            let decCommon1 = CMF.toLittleEndianToBigEndian(common1) as string;
            let parsedec = parseInt(decCommon1, 16);
            console.log(`IVs Common: ${parsedec.toString(16)}`);
            
            for(const [key , bitmask] of Object.entries(HEX.IVS.OPTION)) {
              // ビットマスクの最下位ビットを取得
              // 例: -bitmaskは bitmask の2の補数(ビット反転して 1加算したもの)を取得する
              // log2 により 2の何乗かを取得
              const shiftAmount = Math.log2(bitmask & -bitmask);
              // AND で どちらかのビットが1の場合1を返す
              // 例: 0x0000001E & 0x0000001F = 0x0000001F
              //     0000 0000 0000 0000 0000 0011 1110 0000 (bitmask)
              // &   1111 1111 1111 1111 1111 1100 0010 0000 (-bitmask)
              //-----------------------------------------
              //     0000 0000 0000 0000 0000 0000 0010 0000 (結果)

              // 2の何乗かを取得しているため、右シフトすることで値を取得できる
              const val = (parsedec & bitmask) >> shiftAmount;
              if(val > 0) {
                ivslist[key] = val;
              } else {
                ivslist[key] = 0;
              }
            }

            f_ivs = {
              hp: ivslist.HP,
              attack: ivslist.ATK,
              defense: ivslist.DEF,
              spattack: ivslist.SPA,
              spdefense: ivslist.SPD,
              speed: ivslist.SPE
            }
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
            ivs: f_ivs,
            evs: f_evs,
            level: f_level,
            gender: f_gender,
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