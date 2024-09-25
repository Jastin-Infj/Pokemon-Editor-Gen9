import { FormUserInput } from "@/types";

interface FormUserAction {
  type: "CHANGE" | "RESET";
  key: string;
  payload: FormUserInput;
}

function reducer_FormUser(state: FormUserInput | null, action: FormUserAction): FormUserInput | null {
  if(action === null) return state;

  const init: FormUserInput = {
    username: null,
    password: null
  };

  switch(action.type) {
    case "CHANGE":
      if(!state) {
        state = init;
      }
      return {...state, [action.key]: action.payload};
    case "RESET":
      return null;
  }
}

export { reducer_FormUser };