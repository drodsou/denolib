import {getCurlyVars} from './get_curly_vars.ts';
import {CurlyVar, CurlyTransformed} from './types.ts';

export function curlyTransformProp (
  text:string, parentFile:string, props:any
) : CurlyTransformed
{
  let textTransformed = text;
  for (let curlyVar of getCurlyVars(text, 'prop')) {
    if (!props.hasOwnProperty(curlyVar.content)) {
      throw new Error(`Cannot find prop '${curlyVar.content}' in props, in file '${parentFile}'`);
    }
    textTransformed = textTransformed.replace(new RegExp(curlyVar.text,'g'), props[curlyVar.content]);
  };

  return {
    text: textTransformed
  } as CurlyTransformed
}

