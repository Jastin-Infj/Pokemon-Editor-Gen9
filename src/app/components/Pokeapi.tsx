"use client";
import React from 'react';
import prisma from '@/lib/prisma';
import { PokemonClient } from 'pokenode-ts';
import { PokemonDataBase } from '@/types';

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

  return (
    <div className="flex">
      
    </div>
  )
}

export default Pokeapi;