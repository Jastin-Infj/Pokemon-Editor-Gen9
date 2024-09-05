"use client";
import prisma from "@/lib/prisma";
import { RequestSavePokemonData, UserData } from "@/types";
import { useEffect, useState } from "react";

const UserLogin = () => {
  // await で 非同期処理をするため
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const handleClick = () => {
    setIsClicked(true);
  };

  useEffect(() => {
    if(!isClicked) return;

    const handleSave = async () => {
      const param: UserData = {
        userID: "test",
        userName: "test",
        root: false
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