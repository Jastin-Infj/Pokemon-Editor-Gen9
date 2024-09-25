"use client";
import { FormUserInput, PBaseProps, UserData } from "@/types";
import React, { use, useEffect, useRef, useState } from "react";
import Import from "./Import";

interface Props {
  User_dispatch: React.Dispatch<any>
  UserLogined: boolean
  P_datas_dispatch: React.Dispatch<any>
  FormUser: FormUserInput | null
  FormUser_dispatch: React.Dispatch<any>
}

const UserForm: React.FC<Props> = ({User_dispatch , UserLogined , P_datas_dispatch , FormUser , FormUser_dispatch}) => {
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  // useEffect 依存配列で必要
  const [username , setUsername] = useState<string | null>(null);
  const [password , setPassword] = useState<string | null>(null);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    FormUser_dispatch({type: "CHANGE", key: "username", payload: username as string});
    console.log("username changed to " + username);
  }, [username]);

  const handleChange_Username = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(usernameRef.current?.value === username) return;
    setUsername(event.target.value);
    // 即時反映はされないため useEffect で処理
  }

  const handleChange_Password = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(passwordRef.current?.value === password) return;
    setPassword(event.target.value);
    // 即時反映はされないため useEffect で処理
  }

  useEffect(() => {
    FormUser_dispatch({type: "CHANGE", key: "password", payload: password as string});
    console.log("password changed to " + password);
  }, [password]);

  useEffect(() => {
    if(!isSubmit) return;

    const fetchLogin = async () => {
      switch(UserLogined) {
        case true:
          // Logout
          User_dispatch({type: "LOGOUT"});
          P_datas_dispatch({type: "DELETE_ALL"});
          break;
        case false:
          // Login
          if(!FormUser) {
            console.error("FormUser is null");
            return;
          }
          if(FormUser?.username === "" || FormUser?.password === "") {
            console.error("username or password is empty");
            return;
          }

          const param: UserData = {
            userID: FormUser.username as string,
            userName: FormUser.password as string,
          };

          try {
            const res = await Import(param) as any;
            if(res.error === "No Data") {
              console.error("User not found");
            } else {
              User_dispatch({type: "IMPORT", payload: res[0]});
              // 入力フォームの初期化 
              setUsername(null);
              setPassword(null);
              console.log(res[1]);

              let savedata = res[1] as PBaseProps[];
              savedata.forEach((data: PBaseProps) => {
                P_datas_dispatch({type: "ADD", payload: data});
              });
            }
          } catch (error) {
            console.error(error);
          }
          break;
      }
      setIsSubmit(false);
    };
    fetchLogin();
  }, [isSubmit]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement> ) => {
    // ページ遷移を防ぐ
    event.preventDefault();

    if(UserLogined) {
      // Logout
      setIsSubmit(true);
    } else {
      // Login
      let target = event.target as HTMLFormElement;
      let element_username = target.querySelector("input[type='text']") as HTMLInputElement;
      let element_password = target.querySelector("input[type='password']") as HTMLInputElement;
  
      if(element_username && element_password) {
        setUsername(element_username.value);
        setPassword(element_password.value);
        setIsSubmit(true);

        usernameRef.current ? usernameRef.current.value = "" : null;
        passwordRef.current ? passwordRef.current.value = "" : null;
      } else {
        console.error("element not found");
      }
    }
  }

  return (
    <>
      <form className="flex px-3" onSubmit={handleSubmit}>
        <div>
          <input type="text"     
            placeholder="username"
            ref={usernameRef}
            onBlur={handleChange_Username}
            className="bg-gray-500 text-white placeholder-gray-50 outline-none" />
          <input type="password" 
            placeholder="password"
            ref={passwordRef}
            onBlur={handleChange_Password}
            className="bg-gray-500 text-white placeholder-gray-50 outline-none" />
        </div>
        <div>
          {UserLogined ? (
            <button className="bg-red-400 text-white rounded-sm">Logout</button>
          ) : (
            <button className="bg-blue-400 text-white rounded-sm">Login</button>
          )}
        </div>
      </form>
    </>
  )
}

export default UserForm;