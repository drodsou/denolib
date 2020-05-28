import {getCurlyVars} from './get_curly_vars.ts';
import {getAbsoluteFile} from './get_absolute_file.ts';
import {CurlyVar, CurlyTransformed} from './types.ts';


export function curlyTransformAttach (
  text:string, parentFile:string
) : CurlyTransformed 
{
  let attachments = [];
  let textTransformed = text;
  for (let curlyVar of getCurlyVars(text, 'attach')) {
    let absFile = getAbsoluteFile(curlyVar.content, parentFile);
    attachments.push({absFile, relFile: curlyVar.content});
    textTransformed = textTransformed.replace(new RegExp(curlyVar.text,'g'), curlyVar.content);
  };

  return {
    text: textTransformed,
    attachments
  } as CurlyTransformed
}

