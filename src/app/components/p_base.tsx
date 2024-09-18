"use client";
import {useEffect, useState} from 'react';
import P_ivevSelect from './p_ivevSelect';
import { PBaseProps, UserData } from '@/types';

interface Props {
  Pbase: PBaseProps;
  dispatch_P_datas: React.Dispatch<any>;
  user_Data: UserData | null;
}

const P_base: React.FC<Props> = ({Pbase , dispatch_P_datas , user_Data}) => {
  // チェックボックスの状態を管理
  const [isChecked, setIsChecked] = useState(false);
  // 削除ボタンのスタイルを定義
  const [isDelete, setIsDelete] = useState(false);

  // チェックボックスの状態を変更
  const handleChange = () => {
    setIsChecked(!isChecked);
  };

  // 削除ボタン押下されたら、選択行を削除
  const handleDeleteButton = () => {
    if(!isChecked) return;
    setIsDelete(true);
  };

  // チェックしたら選択行すべてを青くする
  const styleprops = {
    color: isChecked ? "bg-green-600" : "bg-blue-400",
    common: "text-white w-1/12"
  };
  // スタイルを文字列で管理
  const STYLE_STRING = `${styleprops.common} ${styleprops.color}`;

  const stylepropsDelete = {
    color: "bg-red-600",
    common: "mx-10 rounded-md"
  };
  const STYLE_STRING_DELETE = `${stylepropsDelete.common} ${stylepropsDelete.color}`;

  // チェックボックス選択で削除ボタンコンポーネント追加
  const deleteButton = isChecked ? <button onClick={handleDeleteButton} className={STYLE_STRING_DELETE}>Delete</button> : null;

  // 削除ボタンが押されたら処理実行
  useEffect(() => {
    if(!isDelete) return;

    const deleteData = async () => {
      console.log(`Delete: ${Pbase.id}`);
      // client側の削除処理
      dispatch_P_datas({type: "REMOVE", payload: Pbase.id});

      // `id` がある場合はデータベースも削除
      if(Pbase.id) {
        // server側の削除処理
        const pam = {
          type: "DELETE",
          param: Pbase
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
        } catch (err) {
          console.log(err);
        }
      }
    }
    deleteData();
  }, [isDelete]);
  
  if(!isDelete) {
    return (
      <tr className={STYLE_STRING}>
        <td>
          <input type="checkbox" checked={isChecked} onChange={handleChange} />
          {deleteButton}
        </td>
        <td>{Pbase.name}</td>
        <td>{Pbase.move1}</td>
        <td>{Pbase.move2}</td>
        <td>{Pbase.move3}</td>
        <td>{Pbase.move4}</td>
        <td>{Pbase.ability}</td>
        <td>{Pbase.item}</td>
        <td>{Pbase.nature}</td>
        <td>{Pbase.teratype}</td>
        <td>{Pbase.level}</td>
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
