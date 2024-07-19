"use client";
import React from "react";
import * as cheerio from "cheerio";
import { BaseStatus } from "@/types";

const OfficalBase = () => {

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // ボタンを押下したら、ポケモンの公式種族値データを取得
  const handleClick = async () => {
    console.log("ポケモンの公式種族値データを取得");
    // Base URL
    const URL = "https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_National_Pok%C3%A9dex_number";

    // URLからデータ取得
    const res = await fetch(URL);

    if(res.status === 200) {
      // HTML要素として取得
      const text = await res.text();
      
      // table要素を取得しDOM操作を可能にさせる
      const parser = new DOMParser();
      // 文字列をHTML要素に変換
      const doc = parser.parseFromString(text, "text/html");
      if(doc) {
        // table要素をすべて取得
        const tables = doc.querySelectorAll("table.roundy");
        // tbody > tr 抽出
        const trs = tables[0].querySelectorAll("tbody > tr");
        // tr 0番目以降をすべて取得
        const trsArray = Array.from(trs).slice(1);
  
        // td 0 , 2番目を取得
        const tds = trsArray.map(tr => {
          const td = tr.querySelectorAll("td");

          // 一度 returnして別の関数で処理を行う
          return {
            number: td[0].textContent?.replace("#", ""),
            name: td[2].textContent,      
            url: td[2].querySelector("a")?.getAttribute("href")
          };

        });

        // `forEach` の代わりに `map` を使用し、Promiseの配列を作成
        /// 関数を定義することで await を使用できる
        const fetchPromises = tds.map(async (td) => {
          if (!td.number) return null; // リージョンのデータは一度除外

          const url = `https://bulbapedia.bulbagarden.net${td.url}`;

          // 1秒待機
          await delay(1000); 

          const fetchRes = await fetch(url);
          if(fetchRes.status === 200) {
            const htmlText = await fetchRes.text();
            const $ = cheerio.load(htmlText);

            const COMMON_SELECTOR_1 = "div#mw-content-text > div.mw-parser-output > table.roundy > tbody";
            
            // PokemonName
            const engName = $(`${COMMON_SELECTOR_1} > tr:nth-child(1) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(1) > big > big > b`).text();
            const janName = $(`${COMMON_SELECTOR_1} > tr:nth-child(1) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(2) > span > b`).text();

            // types
            const type_1 = $(`${COMMON_SELECTOR_1} > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(1) > table > tbody > tr > td:nth-child(1) > a > span > b`).text();
            const type_2 = $(`${COMMON_SELECTOR_1} > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(1) > table > tbody > tr > td:nth-child(2) > a > span > b`).text();

            // abilities
            const abilites_1 = $(`${COMMON_SELECTOR_1} > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(1) > a:nth-child(1) > span`).text();
            const abilites_2 = $(`${COMMON_SELECTOR_1} > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(1) > a:nth-child(2) > span`).text();
            const abilites_3 = $(`${COMMON_SELECTOR_1} > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(4) > a > span`).text();

            // baseStatus text

            //TODO 次回ここから再開
            const baseStatusText = $("span#Base_stats").closest("h4");
            const table = baseStatusText.next("table");

            console.log(table);

            const COMMON_SELECTOR_2 = "#mw-content-text > div.mw-parser-output";

            const baseStatus:BaseStatus  = {
              hp: null,
              attack: null,
              defense: null,
              spattack: null,
              spdefense: null,
              speed: null
            };

            // Pattean 1
            const TableID_1 = 40;
            // Pattean 2
            const TableID_2 = 32;
            // Pattean 3
            const TableID_3 = 30;

            let pattenFlag = false;

            // Initial ID
            let currentId = TableID_1;

            // base status patten 1
            for(let i = 3; i < (6 + 3);++i) {
              if(!pattenFlag) currentId = TableID_1;
              
              switch(i) {
                case 3:
                  baseStatus.hp = $(`${COMMON_SELECTOR_2} > table:nth-child(${currentId}) > tbody > tr:nth-child(${i}) > th > div:nth-child(2)`).text();
                  
                  // troble none
                  if(baseStatus.hp !== "") {
                    console.log(baseStatus.hp);
                    pattenFlag = true;
                    break;
                  }
                  
                  // Pattean 2
                  currentId = TableID_2;
                  baseStatus.hp = $(`${COMMON_SELECTOR_2} > table:nth-child(${currentId}) > tbody > tr:nth-child(${i}) > th > div:nth-child(2)`).text();
                  if(baseStatus.hp !== "") {
                    console.log(baseStatus.hp);
                    pattenFlag = true;
                    break;
                  }

                  // Pattean 3
                  currentId = TableID_3;
                  baseStatus.hp = $(`${COMMON_SELECTOR_2} > table:nth-child(${currentId}) > tbody > tr:nth-child(${i}) > th > div:nth-child(2)`).text();
                  if(baseStatus.hp !== "") {
                    console.log(baseStatus.hp);
                    pattenFlag = true;
                    break;
                  }

                  break;
                case 4:
                  baseStatus.attack = $(`${COMMON_SELECTOR_2} > table:nth-child(${currentId}) > tbody > tr:nth-child(${i})> th > div:nth-child(2)`).text();
                  break;
                case 5:
                  baseStatus.defense = $(`${COMMON_SELECTOR_2} > table:nth-child(${currentId}) > tbody > tr:nth-child(${i})> th > div:nth-child(2)`).text();
                  break;
                case 6:
                  baseStatus.spattack = $(`${COMMON_SELECTOR_2} > table:nth-child(${currentId}) > tbody > tr:nth-child(${i})> th > div:nth-child(2)`).text();
                  break;
                case 7:
                  baseStatus.spdefense = $(`${COMMON_SELECTOR_2} > table:nth-child(${currentId}) > tbody > tr:nth-child(${i})> th > div:nth-child(2)`).text();
                  break;
                case 8:
                  baseStatus.speed = $(`${COMMON_SELECTOR_2} > table:nth-child(${currentId}) > tbody > tr:nth-child(${i})> th > div:nth-child(2)`).text();
                  break;
              }
            }

            console.log([janName , baseStatus]);

            return doc; // ここでは例としてdoc自体を返していますが、実際には必要な要素を返すべきです。
          }
          return null;
        });

        // Promise.allを使用して、すべてのフェッチ処理が完了するのを待つ
        await Promise.all(fetchPromises)
        .then((results) => {
          // すべてのプロミスが解決した後に実行される処理
          console.log('All fetches are done', results);
        })
        .catch((error) => {
          // いずれかのプロミスが拒否された場合に実行される処理
          console.error('A fetch failed to complete', error);
        });

      }

    }
  };

  return (
    <>
      <div>
        <button onClick={handleClick}>基本データ出力</button>    
      </div>
    </>
  );
};

export default OfficalBase;