"use client";
import { PBaseProps, RequestPokemonData } from '@/types';
import React, {useEffect, useRef, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import { reducer_RequestPokemonData } from './reducer';

interface Props {
  P_datasmethod: React.Dispatch<any>
}

const MyDropzone:React.FC<Props> = ({P_datasmethod}) => {
  const [hexStrings , setHexStrings ] = useState<string[]>([]);
  const [pokemonData , setPokemonData] = useState<RequestPokemonData | null>(null);
  const [fetchData , setFetchData] = useState<any>(null);

  // pokemonData が変更されたら、fetchData を実行
  useEffect(() => {
    if(!pokemonData) return;
    console.log("useEffect called");
    const fetchData = async () => {
      const res:any = await reducer_RequestPokemonData({type: "ADD", payload: pokemonData});
      setFetchData(res);
      console.log(res);

      if(res.length === 0) return;
      let res_dex = res[0];
      let res_spec = res[1];
      let res_type = res[2];
      let res_item = res[3];
      let res_ability = res[4];
      let res_nature = res[5];
      let res_move = res[6];
      let res_teratype = res[7];

      const newPBase: PBaseProps = {
        id: String(res_dex.nationalDexAPI),
        name: res_dex.nameJA,
        move1: res_move[0].moveName,
        move2: res_move[1].moveName,
        move3: res_move[2].moveName,
        move4: res_move[3].moveName,
        ability: res_ability.abilityName,
        item: res_item.itemName,
        nature: res_nature.natureName,
        teratype: res_teratype.typeName,
        level: 50,
      };
      P_datasmethod({type: "ADD", payload: newPBase});
      setFetchData(null);
    };
    fetchData();
  },[pokemonData]);

  const onDrop = (acceptedFiles: File[]) => {
    console.log("onDrop called");

    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      console.log("File Reader onload called");
      const binaryString = event.target?.result as ArrayBuffer;
      if (binaryString) {
         const newHexString = Array.from(new Uint8Array(binaryString)).map(byte => byte.toString(16).padStart(2, '0')).join('');
        setHexStrings([...hexStrings, newHexString]);

        let f_id:number;
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
          const pokemon = newHexString.substring(16 , 16 + 4);
          // バイトオーダーを逆にする
          const pokemonDec = pokemon.substring(2, 4) + pokemon.substring(0, 2);
          // 16進数を10進数に変換
          const decimalValue = parseInt(pokemonDec, 16);
          console.log(`Pokemon: ${decimalValue}`);
          f_id = decimalValue;
        }

        {
          // Item
          const item = newHexString.substring(20 , 20 + 4);
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
          const ability = newHexString.substring(40 , 40 + 4);
          // バイトオーダーを逆にする
          const abilityDec = ability.substring(2, 4) + ability.substring(0, 2);
          // 16進数を10進数に変換
          const decimalValue = parseInt(abilityDec, 16);
          abilityList.push(decimalValue);
  
          // 何番目の特性かどうか？
          const abilityNum = newHexString.substring(44 , 44 + 2);
          const decimalValueNum = parseInt(abilityNum, 16);
          // 1: SET1  2: SET2  4: SET3
          abilityList.push(decimalValueNum);
        }
        console.log(`Ability: ${abilityList}`);
        f_ability = abilityList[0];

        // nature
        const natureList: number[] = [];
        for(let i = 0; i < 2; i++) {
          const nature = newHexString.substring(64 + (i * 2) ,64 + (i * 2) + 2);
          const decimalValue = parseInt(nature , 16);
          natureList.push(decimalValue);
        }
        console.log(`Nature: ${natureList}`);
        f_natureCurrent = natureList[1];

        // move
        const list: number[] = [];
        for (let i = 0; i < 4; i++) {
          const move = newHexString.substring(228 + (i * 4), 228 + (i * 4) + 4);
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
            const tetatype = newHexString.substring(296 + (i * 2), 296 + (i * 2) + 2);
            const decimalValue = parseInt(tetatype, 16); // 16進数を10進数に変換
            teratypes.push(decimalValue);
          }
        }
        // 99: stera  Base , Edit
        console.log(`Teratype Base: ${teratypes[0]} , Edit: ${teratypes[1]}`);
        f_teraTypeCurrent = teratypes[1];

        const request: RequestPokemonData = {
          id: f_id,
          move1: f_move1,
          move2: f_move2,
          move3: f_move3,
          move4: f_move4,
          ability: f_ability,
          item: f_item,
          natureCurrent: f_natureCurrent,
          teraTypeCurrent: f_teraTypeCurrent,
        };
        setPokemonData(request);

      } // if (binaryString)
    }
    reader.readAsArrayBuffer(file);
  }

  const {getRootProps , getInputProps } = useDropzone({onDrop});

  return (
    <>
      <div {...getRootProps()} className='border my-20 h-[4rem] text-center'>
        <input {...getInputProps()} />
        <p className='text-center translate-y-1/2'>ファイルをここにドロップするか、クリックして選択してください</p>
      </div>
      <ul>
        {pokemonData && Object.entries(pokemonData).map(([key, value]) => (
          <li key={key}>{key}: {value}</li>
        ))}
      </ul>
      {hexStrings.map((hexString, index) => (
        <p key={index}>{hexString}</p>
      ))}
    </>
  );
}

export default MyDropzone;
