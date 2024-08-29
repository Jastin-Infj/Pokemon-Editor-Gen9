import { RequestSavePokemonData } from "@/types";


const handleSave = () => {
  console.log("Save");
}

const Save = () => {
  const data: RequestSavePokemonData = {
    column: 0,
    pokemonID: 0,
    pokemonName: "",
    move1: 0,
    move2: 0,
    move3: 0,
    move4: 0,
    ability: 0,
    item: 0,
    nature: 0,
    teraType: 0,
    level: 0,
    ivs: "",
    evs: ""
  };

  return (
    <>
      <button onClick={handleSave} className="bg-red-400  text-white rounded-sm">Pokemon Generation Link Create</button>
    </>
  );
}

export default Save;