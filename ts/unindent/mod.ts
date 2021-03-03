
/**
Removes unwanted start space when using js string templates
TODO: option to keep a number of spaces
TODO: manage tabs, option to convert tabs to spaces befor unindent
*/
export function unindent(str: string) : string {
  const lines = str.split(/\r?\n/).slice(1,-1);
  const indent = lines[0].search(/\S/);
  const out = lines.map(line=>line.slice(indent)).join('\n');
  return out;
}