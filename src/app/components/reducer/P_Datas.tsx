import { PBaseProps, RequestPokemonData, useResponseType } from "@/types";

function reducer_P_Datas(state: PBaseProps[], action: any) {
  switch(action.type) {
    case "ADD":
      return [...state, action.payload];
    case "REMOVE":
      return state.filter((data) => data.id !== action.payload);
    case "DELETE_ALL":
      return [];
    case "UPDATE":
      return state.map((data) => {
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
      return state;
  }
}

interface ActionDispatch {
  type: "FILE" | "Import";
  payload: RequestPokemonData
}

interface GetAction {
  type: "GET_DEX" | "GET_SPECINFO" | "GET_TYPEINFO" | 
  "GET_ITEMINFO" | "GET_ABILITYINFO" | "GET_NATUREINFO" | "GET_MOVEINFO" | "GET_TERATYPEINFO";
  from: useResponseType;
}

interface Request_DEX {
  nationalAPI: number
}

interface Request_SPECINFO {
  basenationalDexAPI: number | null
}

interface Request_TYPEINFO {
  type1: number | null,
  type2: number | null
}

interface Request_ITEMINFO {
  itemid: number | null
}

interface Request_ABILITYINFO {
  abilityidCurrent: number | null,
}

interface Request_NATUREINFO {
  natureCurrent: number | null
}

interface Request_MOVEINFO {
  move1id: number | null,
  move2id: number | null,
  move3id: number | null,
  move4id: number | null
}

interface Request_TERATYPEINFO {
  teraTypeCurrent: number | null
}

type RequestData = Request_DEX | Request_SPECINFO | Request_TYPEINFO | 
Request_ITEMINFO | Request_ABILITYINFO | Request_NATUREINFO | Request_MOVEINFO | 
Request_TERATYPEINFO;

async function reducer_RequestPokemonData(action: ActionDispatch) {
  let requestData = action.payload;
  let req_dex: Request_DEX = {
    nationalAPI: requestData.nationalAPI
  }
  let req_spec: Request_SPECINFO = {
    basenationalDexAPI: null
  }
  let req_type: Request_TYPEINFO = {
    type1: null,
    type2: null
  }
  let req_item: Request_ITEMINFO = {
    itemid: null
  }
  let req_ability: Request_ABILITYINFO = {
    abilityidCurrent: null
  }
  let req_nature: Request_NATUREINFO = {
    natureCurrent: null
  }
  let req_move: Request_MOVEINFO = {
    move1id: null,
    move2id: null,
    move3id: null,
    move4id: null
  }
  let req_teratype: Request_TERATYPEINFO = {
    teraTypeCurrent: null
  }

  let res_dex;
  let res_specinfo;
  let res_typeinfo;
  let res_iteminfo;
  let res_abilityinfo;
  let res_natureinfo;
  let res_moveinfo;
  let res_teratypeinfo;

  let db_nationalDexAPI;

  // リクエスト方法を判定
  let from_param: useResponseType;
  switch(action.type) {
    case "FILE":
      from_param = "client";
      break;
    case "Import":
      from_param = "server";
      break;
  }
  res_dex = await reducer_DBRequest({type: "GET_DEX" , from: from_param} , req_dex);
  req_spec.basenationalDexAPI = res_dex.nationalDexAPI;
  
  res_specinfo = await reducer_DBRequest({type: "GET_SPECINFO" , from: from_param} , req_spec);
  
  req_type.type1 = res_specinfo.type1;
  req_type.type2 = res_specinfo.type2;
  res_typeinfo = await reducer_DBRequest({type: "GET_TYPEINFO" , from: from_param} , req_type);
  
  req_item.itemid = requestData.item;
  res_iteminfo = await reducer_DBRequest({type: "GET_ITEMINFO" , from: from_param} , req_item);
  
  req_ability.abilityidCurrent = requestData.ability;
  res_abilityinfo = await reducer_DBRequest({type: "GET_ABILITYINFO" , from: from_param} , req_ability);
  req_nature.natureCurrent = requestData.natureCurrent;
  res_natureinfo = await reducer_DBRequest({type: "GET_NATUREINFO" , from: from_param} , req_nature);
  req_move.move1id = requestData.move1;
  req_move.move2id = requestData.move2;
  req_move.move3id = requestData.move3;
  req_move.move4id = requestData.move4;
  res_moveinfo = await reducer_DBRequest({type: "GET_MOVEINFO" , from: from_param} , req_move);
  req_teratype.teraTypeCurrent = requestData.teraTypeCurrent;
  res_teratypeinfo = await reducer_DBRequest({type: "GET_TERATYPEINFO" , from: from_param} , req_teratype);
  return [res_dex, res_specinfo, res_typeinfo, res_iteminfo, res_abilityinfo, res_natureinfo, res_moveinfo , res_teratypeinfo];
};

async function reducer_DBRequest(action:GetAction , requestData: RequestData) {
  let req: RequestData;
  let res;
  let req_url;

  let import_headers;
  let header;
  let origin;
  switch(action.from) {
    case "server":
      import_headers = require("next/headers");
      header = import_headers.headers();
      origin = header.get("host");
      break;
  }

  switch(action.type) {
    case "GET_DEX":
      req = requestData as Request_DEX;
      req_url = `/api?nationalAPI=${req.nationalAPI}`;
      switch(action.from) {
        case "client":
          break;
        case "server":
          req_url = `http://${origin}${req_url}`;
          break;
      }

      try {
      res = await fetch(req_url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      res = await res.json();
      return res;
      } catch (error) {
        return {error: error};
      }
    case "GET_SPECINFO":
      req = requestData as Request_SPECINFO;
      req_url = `/api/specinfo?basenationalDexAPI=${req.basenationalDexAPI}`;
      switch(action.from) {
        case "client":
          break;
        case "server":
          req_url = `http://${origin}${req_url}`;
          break;
      }

      try {
        res = await fetch(req_url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        res = await res.json();
        return res;
      } catch (error) {
        return {error: error};
      }
    case "GET_TYPEINFO":
      req = requestData as Request_TYPEINFO;
      req_url = `/api/typeinfo?type1=${req.type1}&type2=${req.type2}`;
      switch(action.from) {
        case "client":
          break;
        case "server":
          req_url = `http://${origin}${req_url}`;
          break;
      }

      try {
        res = await fetch(req_url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        res = await res.json();
        return res;
      } catch (error) {
        return {error: error};
      }
    case "GET_ITEMINFO":
      req = requestData as Request_ITEMINFO;
      req_url = `/api/iteminfo?itemid=${req.itemid}`;
      switch(action.from) {
        case "client":
          break;
        case "server":
          req_url = `http://${origin}${req_url}`;
          break;
      }

      try {
        res = await fetch(req_url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        res = await res.json();
        return res;
      } catch (error) {
        return {error: error};
      }
    case "GET_ABILITYINFO":
      req = requestData as Request_ABILITYINFO;
      req_url = `/api/abilityinfo?abilityidCurrent=${req.abilityidCurrent}`;
      switch(action.from) {
        case "client":
          break;
        case "server":
          req_url = `http://${origin}${req_url}`;
          break;
      }

      try {
        res = await fetch(req_url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        res = await res.json();
        return res;
      } catch (error) {
        return {error: error};
      }
    case "GET_NATUREINFO":
      req = requestData as Request_NATUREINFO;
      req_url = `/api/natureinfo?natureCurrent=${req.natureCurrent}`;
      switch(action.from) {
        case "client":
          break;
        case "server":
          req_url = `http://${origin}${req_url}`;
          break;
      }

      try {
        res = await fetch(req_url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        res = await res.json();
        return res;
      } catch (error) {
        return {error: error};
      }
    case "GET_MOVEINFO":
      req = requestData as Request_MOVEINFO;
      req_url = `/api/moveinfo?move1id=${req.move1id}&move2id=${req.move2id}&move3id=${req.move3id}&move4id=${req.move4id}`;
      switch(action.from) {
        case "client":
          break;
        case "server":
          req_url = `http://${origin}${req_url}`;
          break;
      }

      try {
        res = await fetch(req_url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        res = await res.json();
        return res;
      } catch (error) {
        return {error: error};
      }
    case "GET_TERATYPEINFO":
      req = requestData as Request_TERATYPEINFO;
      // テラスタル 変更前情報は不要
      req_url = `/api/typeinfo?teraTypeCurrent=${req.teraTypeCurrent}`;
      switch(action.from) {
        case "client":
          break;
        case "server":
          req_url = `http://${origin}${req_url}`;
          break;
      }

      try {
        res = await fetch(req_url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        res = await res.json();
        return res;
      } catch (error) {
        return {error: error};
      }
    default:
      break;
  }
};

type CreateMode = "FETCH";
function Create_PBaseProps(mode: CreateMode , option?: any , db_id?: number): PBaseProps | null {
  let res: PBaseProps;
  switch(mode) {
    case "FETCH":
      if(option.length === 0) return null;
      let res_dex = option[0];
      let res_spec = option[1];
      let res_type = option[2];
      let res_item = option[3];
      let res_ability = option[4];
      let res_nature = option[5];
      let res_move = option[6];
      let res_teratype = option[7];

      // P_Base に格納するデータ
      res = {
        id: db_id,
        nationalDexAPI: res_dex.nationalDexAPI,
        name: res_dex.nameJA,
        move1: res_move[0].moveName,
        move2: res_move[1].moveName,
        move3: res_move[2].moveName,
        move4: res_move[3].moveName,
        ability: res_ability.abilityName,
        item: res_item.itemName,
        nature: res_nature.natureName,
        teratype: res_teratype.typeName,
        level: 50,
        // 読み込む際には id なので再度 IDチェックで取得
        innerData: {
          nationalDexAPI: res_dex.nationalDexAPI,
          move1ID: res_move[0].moveID,
          move2ID: res_move[1].moveID,
          move3ID: res_move[2].moveID,
          move4ID: res_move[3].moveID,
          abliityID: res_ability.abilityID,
          itemID: res_item.itemID,
          natureID: res_nature.natureID,
          teraTypeID: res_teratype.typeID,
        }
      };
      return res;
    default:
      return null;
  }
}

export { reducer_P_Datas, reducer_RequestPokemonData, reducer_DBRequest , Create_PBaseProps };