"use client";
import React, { useRef, useState } from 'react';

const Json_input = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleJSONInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: FileList | null = e.target.files;
    if(file) {
      const reader = new FileReader();

      // 読み込み 非同期処理
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          console.log(json);
        } catch (error) {
          console.log("Json Input error", error);
        }
      };

      // これがないと失敗する
      reader.readAsText(file[0]);
    }
  };

  return (
    <>
      <input
        type="file"
        accept='application/json'
        onChange={handleJSONInput}
      />
    </>
  )
}

export default Json_input;
