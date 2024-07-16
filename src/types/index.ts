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