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

            // Init TableID
            let table_ID = 2;
            if(td.number === "0151") table_ID = 3;

            // forms の数を取得する
            const forms= $(`#mw-content-text > div.mw-parser-output > table:nth-child(${table_ID}) > tbody > tr:nth-child(2) > td:nth-child(1) > table > tbody > tr > td`).filter((_ , el): boolean =>  {
              const $el = $(el);
              // 非表示の要素を除外
              const display = $el.css('display');
              const visibility = $el.css('visibility');
              const opacity = $el.css('opacity');

              return display !== 'none' && visibility !== 'hidden' && opacity !== '0';
            });
            
            // forms の数を取得数値に変換
            let formIndex = forms.length;
            switch(td.number) {
              case "0012": // バタフリー
              case "0015": // スピアー
              case "0018": // ピジョット
              case "0065": // フーディン
              case "0068": // カイリキー
              case "0080": // ヤドラン
              case "0094": // ゲンガー
              case "0099": // キングラー
              case "0115": // ガルーラ
              case "0130": // ギャラドス
              case "0131": // ラプラス
              case "0142": // プテラ
                formIndex = 2;
                break;
              case "0003": // フシギバナ
              case "0009": // カメックス
                formIndex = 3;
                break;
              case "0006": // リザードン
              case "0052": // ニャース
                formIndex = 4;
                break
              case "0025": // ピカチュウ
                formIndex = 17;
                break;
              case "0133": // イーブイ
                formIndex = 2;
                break;
            }

            const types = [];

            let typesLen = null;
            switch(td.number) {
              default:
                // types 枠の取得
                typesLen = $(`div#mw-content-text > div.mw-parser-output > table:nth-child(${table_ID}) > tbody > tr:nth-child(2) > td:nth-child(1) > table > tbody > tr > td`).filter((_ , el): boolean =>  {
                const $el = $(el);
                // 非表示の要素を除外
                const display = $el.css('display');
                const visibility = $el.css('visibility');
                const opacity = $el.css('opacity');
  
                return display !== 'none' && visibility !== 'hidden' && opacity !== '0';
                });
  
                typesLen = typesLen.length;
                break;
              case "0128":
                typesLen = 4;
                break;
            }

            switch(td.number) {
              default:
                // types
                for(let i = 1; i <= typesLen;++i) {
                  const types_set = [];

                  const type_1 = $(`${COMMON_SELECTOR_1} > tr:nth-child(${table_ID}) > td > table > tbody > tr > td:nth-child(${i}) > table > tbody > tr > td:nth-child(1) > a > span > b`).text();
                  const type_2 = $(`${COMMON_SELECTOR_1} > tr:nth-child(${table_ID}) > td > table > tbody > tr > td:nth-child(${i}) > table > tbody > tr > td:nth-child(2) > a > span > b`).text();

                  types_set.push(type_1);
                  types_set.push(type_2);

                  types.push(types_set);
                }

                // 違うフォームでタイプが同じ場合、同じタイプを追加
                let diff = formIndex - types.length;
                for(let i = 0; i < diff;++i) {
                  types.push(types[0]);
                }

                break;
              case "0128": // ケンタロス
                for(let y = 1; y <= 2; ++y) {                  
                  for(let x = 1; x <= 2; ++x) {
                    const types_set = [];

                    const type_1 = $(`div#mw-content-text > div.mw-parser-output > table:nth-child(${table_ID}) > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(${y}) > td:nth-child(${x}) > table > tbody > tr > td:nth-child(1) > a > span > b`).text();
                    const type_2 = $(`div#mw-content-text > div.mw-parser-output > table:nth-child(${table_ID}) > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(${y}) > td:nth-child(${x}) > table > tbody > tr > td:nth-child(2) > a > span > b`).text();

                    types_set.push(type_1);
                    types_set.push(type_2);
  
                    types.push(types_set);
                  }
                }
                break;
            }

            //TODO フォームの数を取得範囲場所で毎回取得する必要あり
            //TODO 次回ここから再開
            
            // abilities
            const abilites_1 = $(`${COMMON_SELECTOR_1} > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(1) > a:nth-child(1) > span`).text();
            const abilites_2 = $(`${COMMON_SELECTOR_1} > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(1) > a:nth-child(2) > span`).text();
            const abilites_3 = $(`${COMMON_SELECTOR_1} > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(4) > a > span`).text();

            // baseStatus text

            const baseStatusText = $("span#Base_stats").closest("h4");
            const table = baseStatusText.nextAll("table").first();

            // table から取得

            const baseStatus:BaseStatus  = {
              hp: null,
              attack: null,
              defense: null,
              spattack: null,
              spdefense: null,
              speed: null
            };


            // base status patten 1
            for(let i = 3; i < (6 + 3);++i) {
              
              switch(i) {
                case 3:
                  baseStatus.hp = $(table).find(`tbody > tr:nth-child(${i}) > th > div:nth-child(2)`).text();
                  break;
                case 4:
                  baseStatus.attack = $(table).find(`tbody > tr:nth-child(${i}) > th > div:nth-child(2)`).text();
                  break;
                case 5:
                  baseStatus.defense = $(table).find(`tbody > tr:nth-child(${i}) > th > div:nth-child(2)`).text();
                  break;
                case 6:
                  baseStatus.spattack = $(table).find(`tbody > tr:nth-child(${i}) > th > div:nth-child(2)`).text();
                  break;
                case 7:
                  baseStatus.spdefense = $(table).find(`tbody > tr:nth-child(${i}) > th > div:nth-child(2)`).text();
                  break;
                case 8:
                  baseStatus.speed = $(table).find(`tbody > tr:nth-child(${i}) > th > div:nth-child(2)`).text();
                  break;
              }
            }

            console.log([janName , types , formIndex]);

            return doc; // ここでは例としてdoc自体を返していますが、実際には必要な要素を返すべきです。
          }
          return null;
        });

        // Promise.allを使用して、すべてのフェッチ処理が完了するのを待つ
        await Promise.all(fetchPromises)
        .then((results) => {
          // すべてのプロミスが解決した後に実行される処理
          console.log('All fetches are done');
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