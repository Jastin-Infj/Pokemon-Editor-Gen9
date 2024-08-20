"use client";
import React, { use } from 'react';
import { useState , useEffect } from 'react';
import P_base from './p_base';
import { PBaseProps } from '@/types';

interface Props {
  P_datas: PBaseProps[]
}

const P_baseList:React.FC<Props> = ({P_datas}) => {
  return (
    <>
      {P_datas?.map((data , index) => (
        <P_base key={index} {...data} />
      ))}
    </>
  );
};

export default P_baseList;