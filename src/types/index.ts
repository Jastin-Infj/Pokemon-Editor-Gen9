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

export interface VersionGroupObject {
  level_learned_at: number,
  move_learn_method: object,
  version_group: object
};

export interface PokemonMoveObject {
  move: PokemonAPIObject,
  version_group_details: VersionGroupObject[]
};

export interface PokemonDataBase {
  id: number | null,
  nameJa: string | null,
  nameEn: string | null,
  type1: string | null,
  type2: string | null,
  ability1: string | null,
  ability2: string | null,
  abilityH: string | null,
  basestatus: BaseStatus,
  moves: PokemonMoveObject[],
}

export type PokemonDataBaseName = "DexInfo" | "TypeInfo" | "AbilityInfo" | "MoveInfo" | "ItemInfo" | "NatureInfo" | "BaseInfo" | null;