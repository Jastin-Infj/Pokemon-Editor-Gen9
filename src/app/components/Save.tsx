"use client";
import prisma from "@/lib/prisma";
import { PBaseProps, RequestSavePokemonData, UserData } from "@/types";
import { useEffect, useState } from "react";

interface Props {
  P_datas: PBaseProps[],
  user: UserData | null,
  User_dispatch?: React.Dispatch<any>
}

type SaveOptionType = "CREATE" | "UPDATE" | "ALL_DELETE";
interface SaveParams {
  type: SaveOptionType,
  param: RequestSavePokemonData
}
interface DeleteParams {
  type: SaveOptionType,
  param: UserData
}

const Save:React.FC<Props> = ({P_datas , user , User_dispatch}) => {
  // await で 非同期処理をするため
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const handleClick = () => {
    setIsClicked(true);
  };

  useEffect(() => {
    if(!isClicked) return;

    const handleSave = async () => {
      // user data がない場合は処理を終了
      if(user === null) {
        setIsClicked(false);
        return;
      }

      if(P_datas.length === 0) {
        const pam: DeleteParams = {
          type: "ALL_DELETE",
          param: user
        };
        try {
          const req = await fetch('/api/save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(pam)
          });
          const res = await req.json();
          console.log(res);
          setIsClicked(false);
        } catch (err) {
          console.log(err);
          setIsClicked(false);
        }
        return;
      }

      P_datas.map(async (data , index) => {
        let ivs_format = {
          hp: String(data.ivs.hp),
          atk: String(data.ivs.attack),
          def: String(data.ivs.defense),
          spa: String(data.ivs.spattack),
          spd: String(data.ivs.spdefense),
          spe: String(data.ivs.speed)
        };
        const ivs_text = `${ivs_format.hp}/${ivs_format.atk}/${ivs_format.def}/${ivs_format.spa}/${ivs_format.spd}/${ivs_format.spe}`;

        let evs_format = {
          hp: String(data.evs.hp),
          atk: String(data.evs.attack),
          def: String(data.evs.defense),
          spa: String(data.evs.spattack),
          spd: String(data.evs.spdefense),
          spe: String(data.evs.speed)
        };
        const evs_text = `${evs_format.hp}/${evs_format.atk}/${evs_format.def}/${evs_format.spa}/${evs_format.spd}/${evs_format.spe}`;
        let f_level = data.level ? data.level : 50;

        const pam: RequestSavePokemonData = {
          column: index + 1,
          nationalAPI: Number(data.innerData.nationalDexAPI),
          pokemonName: data.name,
          move1: Number(data.innerData.move1ID),
          move2: Number(data.innerData.move2ID),
          move3: Number(data.innerData.move3ID),
          move4: Number(data.innerData.move4ID),
          ability: Number(data.innerData.abliityID),
          item: Number(data.innerData.itemID),
          nature: Number(data.innerData.natureID),
          teraType: Number(data.innerData.teraTypeID),
          level: f_level,
          ivs: ivs_text,
          evs: evs_text,
          userID: user.userID
        };
        const params: SaveParams = {
          type: "CREATE",
          param: pam
        };

        if(data.id) {
          params.type = "UPDATE";
          params.param.id = data.id;
        }

        try {
          const req = await fetch('/api/save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
          });
          const res = await req.json();
          console.log(res);
          setIsClicked(false);
        } catch (err) {
          console.log(err);
        }
      }); // map
    };

    handleSave();
  }, [isClicked]);

  return (
    <>
      <button onClick={handleClick} className="bg-blue-400 text-white" >Save</button>
    </>
  );

}

export default Save;