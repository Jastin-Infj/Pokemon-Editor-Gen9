export namespace CommonMyFunc {
  // 先頭の文字を大文字に変換する
  export function toCapitalizeFirstLetter(str: string): string {
    if (str.length === 0) {
      return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // ハイフンをスペースに変換する
  export function toReplaceHyphenWithSpace(str: string): string {
    return str.replace(/-/g, ' ');
  }

  // リトルエンディアンからビッグエンディアンに変換する
  export function toLittleEndianToBigEndian(hexstr: string): string | null {
    // 長さが奇数の場合は先頭に0を追加する
    if(hexstr.length % 2 !== 0) {
      hexstr = '0' + hexstr;
    }

    const bytes = hexstr.match(/.{1,2}/g);
    if(bytes === null) return null;
    
    const reversedBytes = bytes.reverse();
    const reversedHexstr = reversedBytes.join('');
    return reversedHexstr;
  }
}