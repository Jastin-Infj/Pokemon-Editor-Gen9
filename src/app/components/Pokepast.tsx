import { PBaseProps } from '@/types';
import React, { use, useEffect, useState } from 'react';
import { CommonMyFunc } from './common/func';
import CMF = CommonMyFunc;

interface Props {
  P_datas: PBaseProps[]
}

const Pokepast: React.FC<Props> = ({P_datas}) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isLinked , setIsLinked] = useState<boolean>(false);
  
  useEffect(() => {
    if(!isClicked) return;
    console.log(`Pokepast clicked`);

    const toStrPokePasteFormat = (str: string): string => {
      let temp: string[];
      str = CMF.toReplaceHyphenWithSpace(str);
      temp = CMF.toStrSplit(str , " ");
      temp = temp.map(ele => {
        return CMF.toCapitalizeFirstLetter(ele);
      });
      str = CMF.toStrJoin(temp , " ");
      return str;
    }

    const copyToClipboard = async (text: string) => {
      if(navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(text);
        } catch(err) {
          console.error("クリップボードへのコピーに失敗しました:", err);
        }
      }
    }

    const Convert_toPokePastData = async (data: PBaseProps) => {
      let nationalAPI = data.nationalDexAPI;

      let req_url = `/api?nationalAPI=${nationalAPI}`;
      let res_pokename:any = await fetch(req_url , {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      res_pokename = await res_pokename.json();

      // res_pokename から nameEN を取得
      let nameEN = CMF.toCapitalizeFirstLetter(res_pokename.nameEN);
      let textPokemon = `${nameEN}`;
      let item = data.item;
      let itemNameupper: string[] | null = null;

      if(data.item) {
        item = toStrPokePasteFormat(data.item);
        item = `@ ${item}`;
        textPokemon = `${nameEN} ${item}`;
      }

      let ivsText = `${data.ivs.hp}/${data.ivs.attack}/${data.ivs.defense}/${data.ivs.spattack}/${data.ivs.spdefense}/${data.ivs.speed}`;
      let ivs = ivsText.split('/',6);
      let ivs_active = ivs.map((iv , index) => {
        if(iv === '31') return true;
        switch(index) {
          case 0:
            return `${iv} HP`;
          case 1:
            return `${iv} Atk`;
          case 2:
            return `${iv} Def`;
          case 3:
            return `${iv} SpA`;
          case 4:
            return `${iv} SpD`;
          case 5:
            return `${iv} Spe`;
        }
      });
      ivs_active = ivs_active.filter((iv) => iv !== true);
      let text_ivs = "";
      if(ivs_active.length !== 0) {
        text_ivs = `IVs: ${ivs_active.join(' / ')}`;
      }

      let evsText = `$`;
      let evs = evsText.split('/',6);
      let evs_active = evs.map((ev , index) => {
        if(ev === '0') return true;
        switch(index) {
          case 0:
            return `${ev} HP`;
          case 1:
            return `${ev} Atk`;
          case 2:
            return `${ev} Def`;
          case 3:
            return `${ev} SpA`;
          case 4:
            return `${ev} SpD`;
          case 5:
            return `${ev} Spe`;
        }
      });
      evs_active = evs_active.filter((ev) => ev !== true);
      let text_evs = ``;
      if(evs_active.length !== 0) {
        text_evs = `EVs: ${evs_active.join(' / ')}`;
      }

      let ability = CMF.toCapitalizeFirstLetter(data.ability);
      let level = String(data.level);
      let nature =  CMF.toCapitalizeFirstLetter(data.nature);

      let move1 , move2 , move3 , move4;
      move1 = toStrPokePasteFormat(data.move1);
      move2 = toStrPokePasteFormat(data.move2);
      move3 = toStrPokePasteFormat(data.move3);
      move4 = toStrPokePasteFormat(data.move4);

      let format = 
        `${textPokemon} \n` +
        `${text_ivs} \n` +
        `${text_evs} \n` +
        `Ability: ${ability} \n` +
        `Level: ${level} \n` + 
        `${nature} Nature \n` +
        `- ${move1} \n` +
        `- ${move2} \n` +
        `- ${move3} \n` +
        `- ${move4}`;
      
      return format;
    }

    let promise = P_datas.map(async (data) => {
      if(data.isClicked) {
        return await Convert_toPokePastData(data);
      } else {
        return Promise.resolve("");
      }
    });
    Promise.all(promise).then(async (res) => {
      let target = "";
      let result = res.filter(element => {
        return element !== ""; 
      });
      let format = CMF.toStrJoin(result , "\n\n");
      await copyToClipboard(format);
      setIsClicked(false);
    });
  }, [isClicked]);

  useEffect(() => {
    if(!isLinked) return;
    setIsLinked(false);
  } , [isLinked]);

  const handleClick = () => {
    setIsClicked(true);
  };

  const handleLink = () => {
    window.open("https://pokepast.es/");
    setIsLinked(true);
  };

  return (
    <>
      <button 
        onClick={handleClick}
        className='mx-4 bg-black text-white rounded-sm'>
          PokePaste to Text
      </button>
      <button
          onClick={handleLink}
          className='mx-4 bg-black text-white rounded-sm'>
          PokePaste Link Go
      </button>
    </>
  )
}

export default Pokepast;