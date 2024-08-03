"use client";
import React from 'react';
import { PokemonClient  , MoveClient } from 'pokenode-ts';
import { PokemonAPIObject, PokemonDataBase } from '@/types';
import { PrismaClient } from '@prisma/client';

/// データベースをPokeAPI から取得する

const Pokeapi = () => {

  const dataFormat: PokemonDataBase = {
    id: null,
    nameJa: null,
    nameEn: null,
    type1: null,
    type2: null,
    ability1: null,
    ability2: null,
    abilityH: null,
    basestatus: {
      hp: null,
      attack: null,
      defense: null,
      spattack: null,
      spdefense: null,
      speed: null
    },
    moves: []
  };

  const handleClickPokemonSelect = async () => {
    const api = new PokemonClient(); // create a PokemonClient

    let id = 6;

    // ID 1を入力したら各言語での名前が返ってくる
    let fetchName = await api.getPokemonSpeciesById(id);
    let fetchBase = await api.getPokemonById(id);

    // 日本語で取得する    
    Promise.resolve(fetchName.names.map(async (nameParam) => {
      switch (nameParam.language.name) {
        case "ja":
          dataFormat.nameJa = nameParam.name;
          break;
        case "en":
          dataFormat.nameEn = nameParam.name;
          break;
      }
    }));

    // タイプを取得する
    Promise.resolve(fetchBase.types.map(async (typeParam) => {
      switch (typeParam.slot) {
        case 1:
          dataFormat.type1 = typeParam.type.name;
          break;
        case 2:
          dataFormat.type2 = typeParam.type.name;
          break;
      }
    }));

    // 特性を取得する
    Promise.resolve(fetchBase.abilities.map(async (abilityParam) => {
      switch (abilityParam.slot) {
        case 1:
          dataFormat.ability1 = abilityParam.ability.name;
          break;
        case 2:
          dataFormat.ability2 = abilityParam.ability.name;
          break;
        case 3:
          dataFormat.abilityH = abilityParam.ability.name;
          break;
      }
    }));

    // 種族値を取得する
    Promise.resolve(fetchBase.stats.map(async (statusParam) => { 
      switch (statusParam.stat.name) {
        case "hp":
          dataFormat.basestatus.hp = statusParam.base_stat;
          break;
        case "attack":
          dataFormat.basestatus.attack = statusParam.base_stat;
          break;
        case "defense":
          dataFormat.basestatus.defense = statusParam.base_stat;
          break;
        case "special-attack":
          dataFormat.basestatus.spattack = statusParam.base_stat;
          break;
        case "special-defense":
          dataFormat.basestatus.spdefense = statusParam.base_stat;
          break;
        case "speed":
          dataFormat.basestatus.speed = statusParam.base_stat;
          break;
      }
    }));

    // 覚えれるわざを取得する
    Promise.resolve(fetchBase.moves.map(async (moveParam) => {
      moveParam ? dataFormat.moves.push(moveParam) : [];
    }));

  };

  const handlePokemon = async () => {
    const api = new PokemonClient(); // create a PokemonClient
    let allPokemon: PokemonAPIObject[] = [];
    let offset = 0;
    const LIMIT = 100;

    // 100件ずつ取得する
    while (true) {
      const pokemonList = await api.listPokemons(offset, LIMIT);
      allPokemon = allPokemon.concat(pokemonList.results);
      offset += LIMIT;
      if (pokemonList.results.length < LIMIT) {
        break;
      }
    }
  };

  const handleTypes = async () => {
    const api = new PokemonClient(); // create a PokemonClient
    let allTypes: PokemonAPIObject[] = [];
    let offset = 0;
    const LIMIT = 25;

    // 25件ずつ取得する
    while (true) {
      const typeList = await api.listTypes(offset, LIMIT);
      allTypes = allTypes.concat(typeList.results);
      offset += LIMIT;
      if (typeList.results.length < LIMIT) {
        console.log(allTypes);
        break;
      }
    }
  };

  const handleMoves = async () => {
    const api = new MoveClient(); // create a PokemonClient
    let allMoves: PokemonAPIObject[] = [];
    let offset = 0;
    const LIMIT = 100;

    // 100件ずつ取得する
    while (true) {
      const moveList = await api.listMoves(offset, LIMIT);
      allMoves = allMoves.concat(moveList.results);
      offset += LIMIT;
      if (moveList.results.length < LIMIT) {
        break;
      }
    }
  };

  const handleAbility = async () => {
    const api = new PokemonClient();
    let allAbility:PokemonAPIObject[] = [];
    let offset = 0;
    const LIMIT = 100;

    // 100件ずつ取得する
    while (true) {
      const abilityList = await api.listAbilities(offset, LIMIT);
      allAbility = allAbility.concat(abilityList.results);
      offset += LIMIT;
      if (abilityList.results.length < LIMIT) {
        console.log(allAbility);
        break;
      }
    }
  }

  const handleItem = async () => {
    const api = new PokemonClient();
    let allItem:PokemonAPIObject[] = [];
    let offset = 0;
    const LIMIT = 20;

    // 20件ずつ取得する
    while (true) {
      let url = `https://pokeapi.co/api/v2/item/?offset=${offset}&limit=${LIMIT}`;
      const itemList = await fetch(url);
      const datas = await itemList.json();

      allItem = allItem.concat(datas.results);
      offset += LIMIT;
      if (datas.results.length < LIMIT) {
        console.log(allItem);
        break;
      } else {
        console.log(offset);
      }
    }
  };

  // 25件ですべて
  const handleNature = async () => {
    const api = new PokemonClient();
    let allNature:PokemonAPIObject[] = [];
    let offset = 0;
    const LIMIT = 25;

    // 25件ずつ取得する
    while (true) {
      let url = `https://pokeapi.co/api/v2/nature/?offset=${offset}&limit=${LIMIT}`;
      const natureList = await fetch(url);
      const datas = await natureList.json();

      allNature = allNature.concat(datas.results);
      offset += LIMIT;
      if (datas.results.length < LIMIT) {
        console.log(allNature);
        break;
      } else {
        console.log(offset);
      }
    }
  }

  const handlePokemonDataBaseInit = () => {
    const prisma = new PrismaClient();
    
    // データベース読み取り
    const pokemonData = prisma.dexINFO.findMany();
    console.log(pokemonData);
  }

  return (
    <div className="flex">
      <button className='mx-3' onClick={handleClickPokemonSelect}>ポケモン名から取得</button>
      <button className='mx-3' onClick={handlePokemon}>ポケモンすべて取得</button>
      <button className='mx-3' onClick={handleTypes}>タイプすべて取得</button>
      <button className='mx-3' onClick={handleMoves}>わざすべて取得</button>
      <button className='mx-3' onClick={handleAbility}>とくせいすべて取得</button>
      <button className='mx-3' onClick={handleItem}>アイテムすべて取得</button>
      <button className='mx-3' onClick={handleNature}>せいかくすべて取得</button>
      <button className='mx-3' onClick={handlePokemonDataBaseInit}>データベース初期化</button>
    </div>
  )
}

export default Pokeapi;