export interface PBaseProps {
  id: string
  name: string;
  move1: string;
  move2: string;
  move3: string;
  move4: string;
  ability: string;
  item: string;
  nature: string;
  teratype: string;
  level?: number;
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
 
export interface DataMoveGroupObject {
  level_learned_at: PokemonDataMoveLearnName,
  move_learn_method: object,
  version_group: PokemonVersionObject
};

export interface DataMoveObject {
  move: PokemonAPIObject,
  version_group_details: DataMoveGroupObject[]
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