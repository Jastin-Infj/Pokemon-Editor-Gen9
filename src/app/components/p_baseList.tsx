"use client";
import React, { use } from 'react';
import { useState , useEffect } from 'react';
import P_base from './p_base';
import { PBaseProps, UserData } from '@/types';

interface Props {
  P_datas: PBaseProps[];
  dispatch_P_datas: React.Dispatch<any>;
  user_Data: UserData | null;
}

const P_baseList:React.FC<Props> = ({P_datas , dispatch_P_datas , user_Data}) => {
  return (
    <>
      {P_datas?.map((data , index) => (
        <P_base key={index} Pbase={data} dispatch_P_datas={dispatch_P_datas} user_Data={user_Data} />
      ))}
    </>
  );
};

export default P_baseList;