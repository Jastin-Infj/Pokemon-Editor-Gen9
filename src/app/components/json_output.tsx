"use client";
import React from 'react';

const Json_output = () => {
  const handleJSONOutput = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("tgest");
  };

  return (
    <button 
      className="bg-blue-700 text-fuchsia-400"
      onClick={handleJSONOutput}
      >
      json出力
    </button>
  );
}

export default Json_output;
