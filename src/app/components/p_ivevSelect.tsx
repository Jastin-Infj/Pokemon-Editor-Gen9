import React from 'react';
import { StyleProps } from '@/types';

const P_ivevSelect: React.FC<StyleProps> = ({color}) => {
  return (
    <select className={color}>
      <option value="ALL">All</option>
      <option value="HABCD">HABCD</option>
    </select>
  );
};

export default P_ivevSelect;
