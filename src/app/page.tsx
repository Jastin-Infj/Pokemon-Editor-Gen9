"use server";
import { PBaseProps } from "@/types";
import P_base from "./components/p_base";
import MyDropzone from "./components/dropzone";
import OfficalBase from "./components/officalBase";

export default async function Home() {
  const testPBase: PBaseProps = {
    id: "001",
    name: "ピカチュウ",
    move1: "10まんボルト",
    move2: "アイアンテール",
    move3: "でんこうせっか",
    move4: "ボルテッカー",
    ability: "せいでんき",
    item: "でんきだま",
    nature: "ようき",
    teratype: "でんき",
    level: 50
  };

  return (
    <>
        <header>
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
              <P_base {...testPBase} />
            </tbody>
          </table>
        </main>
    </>
  );
};
