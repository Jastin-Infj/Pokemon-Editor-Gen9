import Json_output from "../../components/json_output";
import P_base from "../../components/p_base";

export default function Home() {

  return (
    <>
      <header>
        <Json_output />
      </header>
      <main>
        <table className="table-fixed w-full mx-10 my-20">
          <thead className="bg-gray-900">
            <tr className="text-white">
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
          <tbody className="bg-blue-400">
            <P_base />
          </tbody>
        </table>
      </main>
    </>
  );
};
