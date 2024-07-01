"use server";
import React from 'react';

const Json_output = () => {
  const handleJSONOutput = (e: React.MouseEvent<HTMLButtonElement>) => {
    alert('hello');
  };

  return (
    <button 
      className="bg-blue-700 text-fuchsia-400"
      // onClick={handleJSONOutput}
      >
      text
    </button>
  );
}

export default Json_output;
