"use client";
import React from "react";

const OfficalBase = () => {

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
          const fetchRes = await fetch(url);
          if(fetchRes.status === 200) {
            const htmlText = await fetchRes.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, "text/html");

            //TODO 次回ここから再開

            // 必要なHTML要素をここで選択し、返します。
            // 例: doc.querySelector('セレクター')

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