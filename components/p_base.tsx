import React from 'react';
import P_ivevSelect from './p_ivevSelect';


const P_base = () => {
  return (
    <tr className="text-white w-1/12">
      <td>レックウザ</td>
      <td>ガリョウテンセイ</td>
      <td>りゅうのまい</td>
      <td>-</td>
      <td>-</td>
      <td>プレッシャー</td>
      <td>きあいのタスキ</td>
      <td>いじっぱり</td>
      <td>ひこう</td>
      <td>100</td>
      <td>
        <P_ivevSelect />
      </td>
      <td>
        <P_ivevSelect />
      </td>
    </tr>
  );
}

export default P_base;
