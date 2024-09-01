"use client";
import prisma from "@/lib/prisma";
import { RequestSavePokemonData } from "@/types";
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
      const param: RequestSavePokemonData = {
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
        evs: "252/252/4/0/0/0",
        userID: "test"
      };

      try {
        const req = await fetch('/api/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(param)
        });
        const res = await req.json();
        if(res.error.code === "P2002") {
          console.log(new Error("Already data added"));
        } else {
          console.log(res);
        }
        setIsClicked(false);
      } catch (err) {
        console.log(err);
      }
    };

    handleSave();
  }, [isClicked]);

  return (
    <>
      <button onClick={handleClick} className="bg-blue-400 text-white" >Save</button>
    </>
  );

}

export default Save;