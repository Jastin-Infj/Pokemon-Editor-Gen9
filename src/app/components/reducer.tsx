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

interface ActionDispatch {
  type: "ADD" | "UPDATE";
  payload: RequestPokemonData
}

interface GetAction {
  type: "GET_DEX" | "GET_SPECINFO" | "GET_TYPEINFO";
}

interface Request_DEX {
  id: number
}

interface Request_SPECINFO {
  basenationalDexAPI: number | null
}

interface Request_TYPEINFO {
  type1: number | null,
  type2: number | null
}

type RequestData = Request_DEX | Request_SPECINFO | Request_TYPEINFO;

async function reducer_RequestPokemonData(action: ActionDispatch) {
  let requestData = action.payload;
  let req_dex: Request_DEX = {
    id: requestData.id
  }
  let req_spec: Request_SPECINFO = {
    basenationalDexAPI: null
  }
  let req_type: Request_TYPEINFO = {
    type1: null,
    type2: null
  }

  let res_dex;
  let res_specinfo;
  let res_typeinfo;

  let db_nationalDexAPI;
  switch(action.type) {
    case "ADD":
      res_dex = await reducer_DBRequest({type: "GET_DEX"} , req_dex);
      req_spec.basenationalDexAPI = res_dex.nationalDexAPI;

      res_specinfo = await reducer_DBRequest({type: "GET_SPECINFO"} , req_spec);
      req_type.type1 = res_specinfo.type1;
      req_type.type2 = res_specinfo.type2;

      res_typeinfo = await reducer_DBRequest({type: "GET_TYPEINFO"} , req_type);
      return res_typeinfo;
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

async function reducer_DBRequest(action:GetAction , requestData: RequestData) {
  let req: RequestData;
  let res;

  switch(action.type) {
    case "GET_DEX":
      req = requestData as Request_DEX;
      try {
        res = await axios.get('/api', { params: req });
        return res.data;
      } catch (error) {
        return {error: error};
      }
    case "GET_SPECINFO":
      try {
        req = requestData as Request_SPECINFO;
        res = await axios.get('/api/specinfo', { params: req });
        return res.data;
      } catch (error) {
        return {error: error};
      }
    case "GET_TYPEINFO":
      try {
        req = requestData as Request_TYPEINFO;
        res = await axios.get('/api/typeinfo', { params: req });
        return res.data;
      } catch (error) {
        return {error: error};
      }
    default:
      break;
  }
};

export { reducer_P_Datas, reducer_RequestPokemonData, reducer_DBRequest };