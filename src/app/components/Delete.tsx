"use client";
import { useEffect, useState } from "react";

interface Props {
  dispatch_P_datas: React.Dispatch<any>
}

const Delete: React.FC<Props> = ({dispatch_P_datas}) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const handleClick = () => {
    console.log("Delete Button Clicked");
    setIsClicked(true);
  }

  useEffect(() => {
    if(!isClicked) return;
    dispatch_P_datas({type: "DELETE_ALL"});
    setIsClicked(false);
  }, [isClicked]);

  return (
    <>
      <button onClick={handleClick} className="bg-red-400 text-white">ALL Delete</button>
    </>
  )
}

export default Delete;