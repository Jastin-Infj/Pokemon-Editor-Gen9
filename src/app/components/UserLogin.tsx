"use client";
import prisma from "@/lib/prisma";
import { FormUserInput, RequestSavePokemonData, UserData } from "@/types";
import { useEffect, useState } from "react";

interface Props {
  userdata: FormUserInput | null;
}

interface RequestProps {
  type: string;
  userdata: UserData;
}

// TODO Form に入れるため リファクタリングする
const UserLogin: React.FC<Props> = ({userdata}) => {
  // await で 非同期処理をするため
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const handleClick = () => {
    setIsClicked(true);
  };

  useEffect(() => {
    if(!isClicked) return;

    const handleSave = async () => {
      if(!userdata) {
        console.error("userdata is null");
        return;
      }

      const param: RequestProps = {
        type: "CREATE",
        userdata: {
          userName: userdata.username as string,
          userID: userdata.password as string,
          root: false
        }
      };

      try {
        const req = await fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(param)
        });
        const success = await req.json();
        console.log(success);
      } catch (error) {
        console.log(error);
      }
      
    };
    handleSave();
  }, [isClicked]);
  
  return (
    <>
      <button onClick={handleClick} className="bg-red-400  text-white rounded-sm">User Create</button>
    </>
  );
}

export default UserLogin;