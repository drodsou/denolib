import {getCurlyVars} from './get_curly_vars.ts';
import {getAbsoluteFile} from './get_absolute_file.ts';
import {CurlyVar, CurlyTransformed} from './types.ts';


export async function curlyTransformRun (
  text:string, parentFile:string, props:any={} 
) : Promise<CurlyTransformed> 
{
  let textTransformed = text;
  for (let curlyVar of getCurlyVars(text, 'run')) {
    let absFile = getAbsoluteFile(curlyVar.content, parentFile);
    let absFileMod = await import('file://' + absFile + '?' + Math.random());
    let absFileResult: string = await absFileMod.default(props);
    textTransformed = textTransformed.replace(new RegExp(curlyVar.text,'g'), absFileResult);
  };

  return {
    text: textTransformed
  } as CurlyTransformed
}

