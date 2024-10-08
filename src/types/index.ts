export type useResponseType = "client" | "server";

export interface PBaseProps_InnerData {
  nationalDexAPI: number | null,
  move1ID: number,
  move2ID: number,
  move3ID: number,
  move4ID: number,
  abliityID: number,
  itemID: number,
  natureID: number,
  teraTypeID: number
}

export interface PBaseProps {
  nationalDexAPI: number;
  name: string;
  move1: string;
  move2: string;
  move3: string;
  move4: string;
  ability: string;
  item: string | null;
  nature: string;
  teratype: string;
  level?: number;
  id?: number;
  ivs?: string;
  evs?: string;

  // 内部データ
  innerData: PBaseProps_InnerData;
};

export interface StyleProps {
  common?: string;
  color?: string;
}

export interface BaseStatus {
  hp: string | number |  null;
  attack: string | number |  null;
  defense: string | number |  null;
  spattack: string | number |  null;
  spdefense: string | number |  null;
  speed: string | number |  null;
}

export interface PokemonAPIObject {
  name: string,
  url: string
};

export type PokemonDataMoveLearnName = "level-up" | "machine" | "tutor" | "egg";
export type PokemonVersionGroupName = 
  "red-blue" | "yellow" | 
  "gold-silver" | "crystal" | 
  "ruby-sapphire" | "emerald" | "firered-leafgreen" | "colosseum" | "xd" |
  "diamond-pearl" | "platinum" | "heartgold-soulsilver" | 
  "black-white" | "black-2-white-2" | 
  "x-y" | "omega-ruby-alpha-sapphire" | 
  "sun-moon" | "ultra-sun-ultra-moon" | 
  "sword-shield" | "letsgo-pikachu-eevee" |
  "scarlet-violet";

export interface PokemonVersionObject {
  name: PokemonVersionGroupName,
  url: string
};

export interface PokemonMoveLearnMethodObject {
  name: PokemonDataMoveLearnName,
  url: string
}

export interface DataMoveGroupObject {
  level_learned_at: number,
  move_learn_method: PokemonMoveLearnMethodObject,
  version_group: PokemonVersionObject
};

export interface DataMoveObject {
  move: PokemonAPIObject,
  version_group_details: DataMoveGroupObject[],
};

export interface PokemonDataBase {
  nationalDexAPI: number | null,
  nameJa?: string | null,
  nameEn?: string | null,
  type1: string | number |  null,
  type2: string | number | null,
  ability1: string | number |  null,
  ability2: string | number | null,
  ability3: string | number | null,
  basestatus: BaseStatus,
  moves: DataMoveObject[],
}

export type PokemonDataBaseName = "DexInfo" | "TypeInfo" | "AbilityInfo" | "MoveInfo" | "ItemInfo" | "NatureInfo" | "BaseInfo" | null;

export interface DataType {
  slot: number,
  type: {
    name: string,
    url: string
  }
};

export interface DataAbility {
  ability: {
    name: string,
    url: string
  },
  is_hidden: boolean,
  slot: number
};

export type BaseStatusName = "hp" | "attack" | "defense" | "special-attack" | "special-defense" | "speed";
export interface DataBaseStat {
  base_stat: number,
  effort: number,
  stat: {
    name: BaseStatusName,
    url: string
  }
}

export interface RequestPokemonData {
  nationalAPI: number,
  move1: number,
  move2: number,
  move3: number,
  move4: number,
  ability: number,
  item: number,
  natureCurrent: number,
  teraTypeCurrent: number,
  // optional
  id?: number,
  abilityNum?: number,
  natureBase?: number,
  teraTypeBase?: number,
  ivs?: string,
  evs?: string
};

export interface RequestSavePokemonData {
  column: number,
  nationalAPI: number
  pokemonName: string,
  move1: number,
  move2: number,
  move3: number,
  move4: number,
  ability: number,
  item: number,
  nature: number,
  teraType: number,
  level: number,
  ivs: string
  evs: string,
  userID?: string,
  id?: number
}

export interface UserData {
  userID: string,
  userName: string,
  root?: boolean
}

export interface FormUserInput {
  username: string | null,
  password: string | null
}