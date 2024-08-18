"use server";
import { use, useEffect, useState } from "react";
import { PBaseProps } from "@/types";
import MyDropzone from "./components/dropzone";
import P_baseList from "./components/p_baseList";
import Access from "./components/access";

export default async function Home() {
  // const [P_datas, setP_datas] = useState<PBaseProps[]>([]);
  // const [API_data , setAPI_data] = useState<boolean>(false);1

  return (
    <>
        <header>
          {/* <MyDropzone pbase_list={P_datas} set_pbase_list={setP_datas} /> */}
          <Access />
          <MyDropzone />
        </header>
        <main>
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
              <P_baseList />
            </tbody>
          </table>
        </main>
    </>
  );
};
