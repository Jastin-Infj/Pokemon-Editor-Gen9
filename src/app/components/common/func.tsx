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
}