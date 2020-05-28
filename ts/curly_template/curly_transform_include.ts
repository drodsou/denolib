import {getCurlyVars} from './get_curly_vars.ts';
import {getAbsoluteFile} from './get_absolute_file.ts';
import {CurlyVar, CurlyTransformed} from './types.ts';


export function curlyTransformInclude (
  text:string, parentFile:string
) : CurlyTransformed
{
  let textTransformed = text;
  for (let curlyVar of getCurlyVars(text, 'include')) {
    let absFile = getAbsoluteFile(curlyVar.content, parentFile);
    let absFileContent = Deno.readTextFileSync(absFile);
    textTransformed = textTransformed.replace(new RegExp(curlyVar.text,'g'), absFileContent);
  };

  return {
    text: textTransformed
  } as CurlyTransformed
}

