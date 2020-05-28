import {CurlyVar} from './types.ts';

// -- content variables

export function getCurlyVars (text:string, type='') : CurlyVar[] {
  let curlyVarsObj:Record<string,CurlyVar>  = {};  // ensure unique, even if used several times in text
  let varsRE = new RegExp(`({{${type}[^}]*}})`,'g');
  let varsArr = text.match(varsRE) || []; 
  for (let varText of varsArr) {
    let [varType, varContent] = varText.slice(2,-2).trim().split(':').map(x=>x.trim());  // {{img:x.jpg}}
    curlyVarsObj[varText] = {text:varText, type: varType, content: varContent };
  }

  let curlyVars = Object.values(curlyVarsObj);
  return curlyVars;
}