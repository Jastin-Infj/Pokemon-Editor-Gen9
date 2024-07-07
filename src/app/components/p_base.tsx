import React from 'react';
import P_ivevSelect from './p_ivevSelect';
import { PBaseProps } from '@/types';

const P_base: React.FC<PBaseProps> = ({name , move1 , move2 , move3 , move4 , ability , item , nature , teratype , level}) => {
  return (
    <tr className="text-white w-1/12">
      <td>{name}</td>
      <td>{move1}</td>
      <td>{move2}</td>
      <td>{move3}</td>
      <td>{move4}</td>
      <td>{ability}</td>
      <td>{item}</td>
      <td>{nature}</td>
      <td>{teratype}</td>
      <td>{level}</td>
      <td>
        <P_ivevSelect />
      </td>
      <td>
        <P_ivevSelect />
      </td>
    </tr>
  );
}

export default P_base;
