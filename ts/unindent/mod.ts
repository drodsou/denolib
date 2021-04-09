
/**
Removes unwanted start space when using js string templates
TODO: option to keep a number of spaces
TODO: manage tabs, option to convert tabs to spaces befor unindent
*/
export function unindent(str: string) : string {
  let lines = str.split(/\r?\n/)
  if (lines[0].trim().length === 0) { lines = lines.slice(1); }
  if (lines[lines.length-1].trim().length === 0) { lines = lines.slice(0,-1); }
  const indent = lines[0].search(/\S/);
  const out = lines.map(line=>line.slice(indent)).join('\n');
  return out;
}