"use client";
import React, { use } from 'react';
import { useState , useEffect } from 'react';
import P_base from './p_base';
import { PBaseProps } from '@/types';

interface Props {
  pbase_list: PBaseProps[]
}

const P_baseList = () => {
  return (
    <>
      {/* {pbase_list?.map((data , index) => (
        <P_base key={index} {...data} />
      ))} */}
    </>
  );
};

export default P_baseList;