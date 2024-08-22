import { PBaseProps, RequestPokemonData } from "@/types";
import prisma from "@/lib/prisma";
import axios from 'axios';

function reducer_P_Datas(valueData: PBaseProps[], action: any) {
  switch(action.type) {
    case "ADD":
      return [...valueData, action.payload];
    case "REMOVE":
      return valueData.filter((data) => data.id !== action.payload);
    case "UPDATE":
      return valueData.map((data) => {
        if(data.id === action.payload.id) {
          return {
            ...data,
            ...action.payload
          };
        } else {
          return data;
        }
      });
    default:
      return valueData;
  }
}

async function reducer_RequestPokemonData(requestData: RequestPokemonData , action:any) {
  let res;
  let res_specinfo;

  let db_nationalDexAPI;
  switch(action.type) {
    case "ADD":
      res = await reducer_DBRequest(requestData , {type: "GET_DEX"});
      db_nationalDexAPI = res.nationalDexAPI;
      res_specinfo = await reducer_DBRequest(db_nationalDexAPI , {type: "GET_SPECINFO"});
      return res_specinfo;
      break;
    case "UPDATE":
      return {
        ...requestData,
        ...action.payload
      };
    default:
      return requestData;
  }
};

async function reducer_DBRequest(requestData: any , action:any) {
  let res;
  let param;
  let nationalDexAPI;

  switch(action.type) {
    case "GET_DEX":
      try {
        param = {
          id: requestData.id
        }
        res = await axios.get('/api', { params: param });
        return res.data;
      } catch (error) {
        return {error: error};
      }
    case "GET_SPECINFO":
      try {
        nationalDexAPI = requestData;
        param = {
          basenationalDexAPI: nationalDexAPI 
        }
        res = await axios.get('/api/specinfo', { params: param });
        return res.data;
      } catch (error) {
        return {error: error};
      }
    default:
      break;
  }
};

export { reducer_P_Datas, reducer_RequestPokemonData, reducer_DBRequest };