"use client";
import {useState} from 'react';
import P_ivevSelect from './p_ivevSelect';
import { PBaseProps } from '@/types';

const P_base: React.FC<PBaseProps> = ({name , move1 , move2 , move3 , move4 , ability , item , nature , teratype , level}) => {
  // チェックボックスの状態を管理
  const [isChecked, setIsChecked] = useState(false);
  // チェックしたら選択行すべてを青くする
  const styleprops = {
    color: isChecked ? "bg-green-600" : "bg-blue-400",
    common: "text-white w-1/12"
  };
  // スタイルを文字列で管理
  const STYLE_STRING = `${styleprops.common} ${styleprops.color}`;


  // 削除ボタンのスタイルを定義
  const [isDelete, setIsDelete] = useState(false);
  const stylepropsDelete = {
    color: "bg-red-600",
    common: "mx-10 rounded-md"
  };
  const STYLE_STRING_DELETE = `${stylepropsDelete.common} ${stylepropsDelete.color}`;

  // チェックボックスの状態を変更
  const handleChange = () => {
    setIsChecked(!isChecked);
  };

  // 削除ボタン押下されたら、選択行を削除
  const handleDeleteButton = () => {
    setIsDelete(true);
  };

  // チェックボックス選択で削除ボタンコンポーネント追加
  const deleteButton = isChecked ? <button onClick={handleDeleteButton} className={STYLE_STRING_DELETE}>Delete</button> : null;

  if(!isDelete) {
    return (
      <tr className={STYLE_STRING}>
        <td>
          <input type="checkbox" checked={isChecked} onChange={handleChange} />
          {deleteButton}
        </td>
        <td>{name}</td>
        <td>{move1}</td>
        <td>{move2}</td>
        <td>{move3}</td>
        <td>{move4}</td>
        <td>{ability}</td>
        <td>{item}</td>
        <td>{nature}</td>
        <td>{teratype}</td>
        <td>{level}</td>
        <td>
          <P_ivevSelect {...styleprops}/>
        </td>
        <td>
          <P_ivevSelect {...styleprops} />
        </td>
      </tr>
    );
  } else {
    // 削除ボタン押下されたら、nullを返す
    return null;
  }

}

export default P_base;
