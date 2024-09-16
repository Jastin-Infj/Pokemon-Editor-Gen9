import { UserData } from "@/types";

type ActionType = "IMPORT";
interface UserAction {
  type: ActionType;
  payload: UserData;
}

function reducer_User(state: UserData | null , action: UserAction): UserData | null {
  if(action === null) return null;

  switch(action.type) {
    case "IMPORT":
      return action.payload;
  }
}

export { reducer_User };