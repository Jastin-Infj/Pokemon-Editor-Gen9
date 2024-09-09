"use server";
import { UserData } from "@/types";
import { headers } from "next/headers";

interface Props {
  P_datasmethod: React.Dispatch<any>
}

interface ImportSaveData {
  f_userID: string,
  column: number,
  id: number,
  PokemonID: number,
  PokemonName: string | null,
  move1: number,
  move2: number,
  move3: number,
  move4: number,
  ability: number,
  item: number,
  nature: number,
  teratype: number,
  level: number,
  Ivs: string,
  Evs: string
}

const Import = async () => { 
  console.log("--- Import Start ---");
  const FetchData = async () => {
    let param: UserData = {
      userID: "test",
      userName: "test"
    };
    const headerList = headers();
    const origin = headerList.get('host');

    try {
      const res = await fetch(`http://${origin}/api/user?userID=${param.userID}&userName=${param.userName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const user: UserData = await res.json();
      const res2 = await fetch(`http://${origin}/api/save?userID=${user.userID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const savedata = await res2.json();
      return savedata;
    } catch (error) {
      console.log(error);
    }
  };

  // Main Process
  try {
    const datas = await FetchData();
    return datas;
  } catch (error) {
    console.error('Error in Import:', error);
    return { error: error };
  }
};
export default Import;