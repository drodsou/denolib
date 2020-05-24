/** 
 * splits string by words, but preserving double quoted strings togeteher 
 * ref: https://stackoverflow.com/questions/2817646/javascript-split-string-on-space-or-on-quotes-to-array
*/
export function tokenize (s:string) : string[] {
  return (s.match(/[^\s"]+|"([^"]*)"/gi)||[])
    .map(w => w[0 ]=== '"' ? w.slice(1,-1) : w);

}
