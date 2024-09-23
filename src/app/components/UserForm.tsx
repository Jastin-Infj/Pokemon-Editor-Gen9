"use client";
import { PBaseProps, UserData } from "@/types";
import React, { useEffect, useRef, useState } from "react";
import Import from "./Import";

interface Props {
  User_dispatch: React.Dispatch<any>
  UserLogined: boolean
  P_datas_dispatch: React.Dispatch<any>
}

const UserForm: React.FC<Props> = ({User_dispatch , UserLogined , P_datas_dispatch}) => {
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [username , setUsername] = useState<string | null>(null);
  const [password , setPassword] = useState<string | null>(null);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

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
          if(!username && !password) {
            setUsername(null);
            setPassword(null);
          }
      
          const param: UserData = {
            userID: username as string,
            userName: password as string,
          };

          try {
            const res = await Import(param) as any;
            if(res.error === "No Data") {
              console.error("User not found");
            } else {
              User_dispatch({type: "IMPORT", payload: res[0]});
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
          <input type="text"     placeholder="username" ref={usernameRef} className="bg-gray-500 text-white placeholder-gray-50 outline-none" />
          <input type="password" placeholder="password" ref={passwordRef} className="bg-gray-500 text-white placeholder-gray-50 outline-none" />
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