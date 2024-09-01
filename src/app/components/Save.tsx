"use client";
import prisma from "@/lib/prisma";
import { RequestSavePokemonData } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";



const Save = () => {
  // await で 非同期処理をするため
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const handleClick = () => {
    setIsClicked(true);
  };

  useEffect(() => {
    if(!isClicked) return;
    
    const handleSave = async () => {
      const req: RequestSavePokemonData = {
        column: 1,
        pokemonID: 1,
        pokemonName: "test",
        move1: 1,
        move2: 2,
        move3: 3,
        move4: 4,
        ability: 1,
        item: 1,
        nature: 1,
        teraType: 1,
        level: 50,
        ivs: "31/31/31/31/31/31",
        evs: "252/252/4/0/0/0"
      };

      const param = {
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
      
      // try {
      //   await axios.post("/api/save", req);
      //   setIsClicked(false);
      // } catch (error) {
      //   console.log(error);
      // }
    };
    handleSave();
  }, [isClicked]);
  
  return (
    <>
      <button onClick={handleClick} className="bg-red-400  text-white rounded-sm">Pokemon Generation Link Create</button>
    </>
  );
}

export default Save;