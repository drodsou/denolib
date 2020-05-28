import {getCurlyVars} from './get_curly_vars.ts';
import {CurlyVar, CurlyTransformed} from './types.ts';

/** checks ref aginst props and adds link and optionally ref number 
 * props.refs = [{code, desc, url,  type, isbn, author, edicion...}, ... ]
*/
export function curlyTransformRef (
  text:string, parentFile:string, props:any
) : CurlyTransformed
{
  let textTransformed = text;
  for (let curlyVar of getCurlyVars(text, 'ref')) {
    let [refCodePath, refDesc] = curlyVar.content.split(',');
    let [_, refCode, refPath] = refCodePath.match(/([^\/#]+)(.*)/) || [];

    let refNumber = (props.refs||[]).findIndex( (e:any)=>e.code === refCode );
    if (refNumber === -1) {
      throw new Error(`Cannot find reference '${refCode}', in file ${parentFile}`);
    }
    
    let refUrl = props.refs[refNumber].url + refPath;
    refDesc = refDesc || props.refs[refNumber].desc

    let refOutput = refUrl === "undefined"
      ? refDesc
      : `<a href="${refUrl}" target="_blank" rel="noopener noreferrer">${refDesc}</a>`;
    
    if (props.refsNumbers) {
      refOutput += ` [${refNumber}]`
    }

    textTransformed = textTransformed.replace(new RegExp(curlyVar.text,'g'), refOutput);

  };

  return {
    text: textTransformed
  } as CurlyTransformed
}
