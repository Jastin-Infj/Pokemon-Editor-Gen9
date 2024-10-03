import { PBaseProps } from '@/types';
import React, { use, useEffect, useState } from 'react';
import { CommonMyFunc } from './common/func';
import CMF = CommonMyFunc;

interface Props {
  P_datas: PBaseProps[]
}

const Pokepast: React.FC<Props> = ({P_datas}) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  
  useEffect(() => {
    if(!isClicked) return;
    console.log(`Pokepast clicked`);
    console.log(P_datas);
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
      let textPokemon = `${nameEN}\n`;
      let item = data.item;
      if(item) {
        item = CMF.toCapitalizeFirstLetter(data.item as string);
        item = CMF.toReplaceHyphenWithSpace(item);
        item = `@ ${item}`;
        textPokemon = `${nameEN} ${item}\n`;
      }

      //TODO 後ほど修正
      let ivsText = `31/0/31/15/23/31`;
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
      let text_ivs = ``;
      if(ivs_active.length !== 0) {
        text_ivs = `IVs: ${ivs_active.join(' / ')}\n`;
      }

      let evsText = `252/252/4/0/0/0`;
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
        text_evs = `EVs: ${evs_active.join(' / ')}\n`;
      }

      let ability = CMF.toCapitalizeFirstLetter(data.ability);
      let level = String(data.level);
      let nature =  CMF.toCapitalizeFirstLetter(data.nature);

      let move1 = CMF.toCapitalizeFirstLetter(data.move1);
      move1 = CMF.toReplaceHyphenWithSpace(move1);

      let move2 = CMF.toCapitalizeFirstLetter(data.move2);
      move2 = CMF.toReplaceHyphenWithSpace(move2);

      let move3 = CMF.toCapitalizeFirstLetter(data.move3);
      move3 = CMF.toReplaceHyphenWithSpace(move3);

      let move4 = CMF.toCapitalizeFirstLetter(data.move4);
      move4 = CMF.toReplaceHyphenWithSpace(move4);

      let format = 
        `${textPokemon}` +
        `${text_ivs}` +
        `${text_evs}` +
        `Ability: ${ability}\n` +
        `Level: ${level}\n` + 
        `${nature} Nature\n` +
        `- ${move1}\n` +
        `- ${move2}\n` +
        `- ${move3}\n` +
        `- ${move4}\n` ;
      
      return format;
    }

    let promise = P_datas.map(async (data) => {
      return await Convert_toPokePastData(data);
    });
    Promise.all(promise).then((res) => {
      console.log(res);
      setIsClicked(false);
    });
  }, [isClicked]);

  const handleClick = () => {
    setIsClicked(true);
  };

  return (
    <>
      <button 
        onClick={handleClick}
        className='bg-black text-white rounded-sm'>
          Pokepast to link create
      </button>
    </>
  )
}

export default Pokepast;