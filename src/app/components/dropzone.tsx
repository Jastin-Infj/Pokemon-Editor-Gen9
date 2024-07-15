"use client";
import {useRef, useState} from 'react';
import {useDropzone} from 'react-dropzone';

const MyDropzone = () => {
  const [hexStrings , setHexStrings ] = useState<string[]>([]);
  const inputRef = useRef(null);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryString = event.target?.result as ArrayBuffer;
      if (binaryString) {
         const newHexString = Array.from(new Uint8Array(binaryString)).map(byte => byte.toString(16).padStart(2, '0')).join('');
        setHexStrings([...hexStrings, newHexString]);
        
        {
          // Pokemon
          const pokemon = newHexString.substring(16 , 16 + 4);
          // バイトオーダーを逆にする
          const pokemonDec = pokemon.substring(2, 4) + pokemon.substring(0, 2);
          // 16進数を10進数に変換
          const decimalValue = parseInt(pokemonDec, 16);
          console.log(decimalValue);
        }

        {
          // Item
          const item = newHexString.substring(20 , 20 + 4);
          // バイトオーダーを逆にする
          const itemDec = item.substring(2, 4) + item.substring(0, 2);
          // 16進数を10進数に変換
          const decimalValue = parseInt(itemDec, 16);
          console.log(decimalValue);
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
        console.log(abilityList);

        // nature
        const natureList: number[] = [];
        for(let i = 0; i < 2; i++) {
          const nature = newHexString.substring(64 + (i * 2) ,64 + (i * 2) + 2);
          const decimalValue = parseInt(nature , 16);
          natureList.push(decimalValue);
        }
        console.log(natureList);

        // move
        const list: number[] = [];
        for (let i = 0; i < 4; i++) {
          const move = newHexString.substring(228 + (i * 4), 228 + (i * 4) + 4);
          const reversedMove = move.substring(2, 4) + move.substring(0, 2); // バイトオーダーを逆にする
          const decimalValue = parseInt(reversedMove, 16); // 16進数を10進数に変換
          list.push(decimalValue);
        }
        console.log(list);

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
        console.log(teratypes);

      }
    }

    reader.readAsArrayBuffer(file);
  }

  const {getRootProps , getInputProps } = useDropzone({onDrop});

  return (
    <>
      <div {...getRootProps()} className='border my-20 h-[4rem] text-center'>
        <input {...getInputProps()} ref={inputRef}/>
        <p className='text-center translate-y-1/2'>ファイルをここにドロップするか、クリックして選択してください</p>
      </div>
      {hexStrings.map((hexString, index) => (
        <p key={index}>{hexString}</p>
      ))}
    </>
  );
}

export default MyDropzone;
