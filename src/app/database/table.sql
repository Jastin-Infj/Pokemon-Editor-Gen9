USE POKEMON_API_VAILLA;

-- 図鑑No
CREATE TABLE IF NOT EXISTS DexINFO(
  nationalDexAPI INT NOT NULL PRIMARY KEY,
  nationalDex INT,
  nameJA VARCHAR(255) NOT NULL,
  nameEN VARCHAR(255) NOT NULL
);

-- 情報のみ
CREATE TABLE IF NOT EXISTS TypeINFO(
  typeID INT NOT NULL UNIQUE,
  typeName VARCHAR(255) NOT NULL UNIQUE
);

-- 情報のみ
CREATE TABLE IF NOT EXISTS AbilityINFO(
  abilityID INT NOT NULL UNIQUE,
  abilityName VARCHAR(255) NOT NULL UNIQUE
);

-- 情報のみ
CREATE TABLE IF NOT EXISTS MoveINFO(
  moveID INT NOT NULL UNIQUE,
  moveName VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS BaseInfo (
  nationalDexAPI INT NOT NULL,
  type1_ID INT NOT NULL,
  type2_ID INT,
  ability1 INT NOT NULL,
  ability2 INT,
  ability3 INT,
  moveList JSON NOT NULL,
  baseHP INT NOT NULL,
  baseAttack INT NOT NULL,
  baseDefense INT NOT NULL,
  baseSpAtk INT NOT NULL,
  baseSpDef INT NOT NULL,
  baseSpeed INT NOT NULL,
  FOREIGN KEY (nationalDexAPI) REFERENCES DexINFO(nationalDexAPI), -- 外部キー制約
  FOREIGN KEY (type1_ID) REFERENCES TypeINFO(typeID), -- 外部キー制約
  FOREIGN KEY (type2_ID) REFERENCES TypeINFO(typeID), -- 外部キー制約
  FOREIGN KEY (ability1) REFERENCES AbilityINFO(abilityID), -- 外部キー制約
  FOREIGN KEY (ability2) REFERENCES AbilityINFO(abilityID), -- 外部キー制約
  FOREIGN KEY (ability3) REFERENCES AbilityINFO(abilityID) -- 外部キー制約
);