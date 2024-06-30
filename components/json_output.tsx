'use client';
import React from 'react';

const Json_output = () => {
  const handleJSONOutput = (e: React.MouseEvent<HTMLButtonElement>) => {
    alert('hello');
  };

  return (
    <button 
      className="bg-blue-500 rounded border text-white"
      onClick={handleJSONOutput}>
      JSON 出力
    </button>
  );
}

export default Json_output;
