"use client";
import React, { cache, useEffect, useReducer, useState } from "react";
import { PBaseProps, UserData } from "@/types";
import MyDropzone from "./components/dropzone";
import P_baseList from "./components/p_baseList";
import Access from "./components/access";
import { reducer_P_Datas } from "./components/reducer/P_Datas";
import UserLogin from "./components/UserLogin";
import Save from "./components/Save";
import Import from "./components/Import";
import { reducer_User } from "./components/reducer/User";
import Delete from "./components/Delete";
import UserForm from "./components/UserForm";
import { reducer_FormUser } from "./components/reducer/FormUser";

const initFetchData = cache(async () => {
  const res = await Access();
  return res;
});

const Home = () => {
  const [P_datas, dispatch_P_datas] = useReducer(reducer_P_Datas, []);
  const [User , dispatch_User] = useReducer(reducer_User , null);
  const [formUser , dispatch_FormUser] = useReducer(reducer_FormUser, null);

  const [isLogin , setIsLogin] = useState<boolean>(false);
  const [API_data , setAPI_data] = useState<boolean>(false);

  // dispatch は clientのみ利用可能なため、server側での利用は不可
  const importData = cache(async () => {
    const res = await Import(User);
    return res;
  });


  useEffect(() => {
    if(API_data) return;
    initFetchData().then((res) => {
      if(res === 200) setAPI_data(true);
    });

    importData().then((res: any) => {
      if(res.error === "No Data") {
        return;
      }
      let user = res[0] as UserData;
      dispatch_User({type: "IMPORT", payload: user});
      setIsLogin(true);

      // 保存データから client へ反映
      let savedata = res[1] as PBaseProps[];
      savedata.forEach((data: PBaseProps) => {
        dispatch_P_datas({type: "ADD", payload: data});
      });
    }).catch((error) => {
      console.log(error);
    });
    
  }, []);

  useEffect(() => {
    if(P_datas.length === 0) return;
    console.log(P_datas);
  }, [P_datas]);

  // ログイン状態はユーザー情報の影響配下にあるため受ける側として処理
  useEffect(() => {
    User ? setIsLogin(true) : setIsLogin(false);
  }, [User]);

  return (
    <>
        <header>
          {/* <MyDropzone pbase_list={P_datas} set_pbase_list={setP_datas} /> */}
          {/* <Access /> */}
          <MyDropzone dispatch_P_datas={dispatch_P_datas} P_datas={P_datas} />
        </header>
        <div className="my-5">
          <h1>{API_data ? "Fin" : "loading..."}</h1>
          <h1>{P_datas.length}</h1>
        </div>
        <main>
          <h1>{User?.userID}</h1>
          <UserForm User_dispatch={dispatch_User} UserLogined={isLogin} P_datas_dispatch={dispatch_P_datas} FormUser={formUser} FormUser_dispatch={dispatch_FormUser}/>
          <UserLogin userdata={formUser} />
          <Save P_datas={P_datas} user={User} User_dispatch={dispatch_User} />
          <Delete dispatch_P_datas={dispatch_P_datas} />
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
              <P_baseList P_datas={P_datas} dispatch_P_datas={dispatch_P_datas} user_Data={User} />
            </tbody>
          </table>
        </main>
    </>
  );
};

export default Home;