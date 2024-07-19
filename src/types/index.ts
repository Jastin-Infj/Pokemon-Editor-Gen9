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
  hp: string | null;
  attack: string | null;
  defense: string | null;
  spattack: string | null;
  spdefense: string | null;
  speed: string | null;
}