"use client";
import React, { cache, useEffect, useReducer, useState } from "react";
import { PBaseProps } from "@/types";
import MyDropzone from "./components/dropzone";
import P_baseList from "./components/p_baseList";
import Access from "./components/access";
import { reducer_P_Datas } from "./components/reducer";
import UserLogin from "./components/UserLogin";
import Save from "./components/Save";
import Import from "./components/Import";

const initFetchData = cache(async () => {
  const res = await Access();
  return res;
});

// dispatch は clientのみ利用可能なため、server側での利用は不可
const importData = cache(async () => {
  const res = await Import();
  return res;
});

const Home = () => {
  const [P_datas, dispatch] = useReducer(reducer_P_Datas, []);
  const [API_data , setAPI_data] = useState<boolean>(false);

  useEffect(() => {
    if(API_data) return;
    initFetchData().then((res) => {
      if(res === 200) setAPI_data(true);
    });

    importData().then((res) => {
      console.log(res);
      // TODO: 実際のデータを取得する
    });
    
  }, []);

  return (
    <>
        <header>
          {/* <MyDropzone pbase_list={P_datas} set_pbase_list={setP_datas} /> */}
          {/* <Access /> */}
          <MyDropzone P_datasmethod={dispatch} />
        </header>
        <div className="my-5">
          <h1>{API_data ? "Fin" : "loading..."}</h1>
          <h1>{P_datas.length}</h1>
        </div>
        <main>
          <UserLogin />
          <Save P_datas={P_datas} />
          <table className="table-fixed w-full mx-10 my-20">
            <thead className="bg-gray-900">
              <tr className="text-white">
                <td></td>
                <td>ポケモン</td>
                <td>わざ1</td>
                <td>わざ2</td>
                <td>わざ3</td>
                <td>わざ4</td>
                <td>とくせい</td>
                <td>アイテム</td>
                <td>せいかく</td>
                <td>テラスタル</td>
                <td>レベル</td>
                <td>IVs</td>
                <td>Evs</td>
              </tr>
            </thead>
            <tbody>
              <P_baseList P_datas={P_datas} />
            </tbody>
          </table>
        </main>
    </>
  );
};

export default Home;