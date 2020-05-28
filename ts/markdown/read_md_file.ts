import mdParts from './md_parts.ts';
import marked from 'https://unpkg.com/marked@1.0.0/lib/marked.esm.js';
import * as path from "https://deno.land/std/path/mod.ts";
import {red as colorRed} from 'https://deno.land/std/fmt/colors.ts';
import {slashJoin} from '../slash_join/mod.ts';

type MdProcessed = {
  frontmatter: { 
    [key:string] : string  
  },  
  content: string, 
  html: string,
  attachments: {
    relFile: string,
    absFile: string
  }[]
}

/**
 * ASYNC: Reads md file, gets parts and  (if !summaryOnly) also process variables, adds derived html from content.
 * Variables recognized:
 * - run: inserts result of script fil
 * - include: inserts content of file
 * - attach: mark file as dependency eg:  
 *   - <img src="{{attach:_data/img.jpg">
 *   - <a href="{{attach:_data/file.pdf">
 * - props: frontmatter field + arbitrary props object 
 * - ref: predefined reference (bibliographica, character, url), code must exist in props.cites  
 *   - {{cite:sagan1994/home,Pale blue dot}} optional specifying extra url parts if cite has a .url, and also optional custom text description overriding default ref description
 */
export default async function readMdFile (
  file:string, 
  summaryOnly:boolean = false, 
  props:any = {} 
) : Promise<MdProcessed>
{
  let parts = mdParts(Deno.readTextFileSync(file));
  let mdProcessed: MdProcessed = {
    frontmatter: parts.frontmatter,
    content: '', 
    html: '', 
    attachments: []
  }

  // -- summary only, ommit process content variables
  if (summaryOnly) { 
    return mdProcessed;
  }

  // -- process content variables (documentation above)
  for (let [vText,vObj] of Object.entries(parts.variables)) {
    if (!['run','include','attach','props','ref'].includes(vObj.type) ) {
      console.log(colorRed(`Unknown variable type '${vObj.type}'`));
      console.log(colorRed(`in markdown file '${file}'`));
      Deno.exit(1);
    }

    // -- props variable
    if (vObj.type === 'props') {
      let res = {...props, ...parts.frontmatter}
      parts.content = parts.content.replace(new RegExp(vText,'g'), res[vObj.content]);
      continue;
    }

     // -- ref variable
     // -- props.refs = [{code, desc, url,  type, isbn, author, edicion...}, ... ]
     if (vObj.type === 'ref') {
      //let [_, refCode, refPath, refDesc] = vObj.content.match(/([^\/,]+)(\/[^,]+)?[,]?(.*)/);
      let [refCodePath, refDesc] = vObj.content.split(',');
      let [_, refCode, refPath] = refCodePath.match(/([^\/#]+)(.*)/) || [];

      let refNumber = (props.refs||[]).findIndex( (e:any)=>e.code === refCode );
      if (refNumber === -1) {
        console.log(colorRed(`Cannot find reference '${refCode}'`));
        console.log(colorRed(`in markdown file '${file}'`));
        Deno.exit(1);
      }
      
      let refUrl = props.refs[refNumber].url + refPath;
      refDesc = refDesc || props.refs[refNumber].desc

      let refOutput = refUrl === "undefined"
        ? refDesc
        : `<a href="${refUrl}" target="_blank" rel="noopener noreferrer">${refDesc}</a>`;
      
      if (props.refsNumbers) {
        refOutput += ` [${refNumber}]`
      }

      parts.content = parts.content.replace(new RegExp(vText,'g'), refOutput);
      continue;
    }


    // -- absolutize paths (variables that deal with files bellow)
    
    let varFileAbs = path.isAbsolute(vObj.content) 
      ? vObj.content
      : slashJoin( path.resolve(path.dirname(file)), vObj.content);
    
    try {
      Deno.statSync(varFileAbs)
    } catch (e) {
      console.log(colorRed(`Cannot find referenced file '${varFileAbs}'`));
      console.log(colorRed(`in markdown file '${file}'`));
      Deno.exit(1);
    }

    // -- var types
    if (vObj.type === 'run') {
      let resMod = await import('file://' + varFileAbs);
      let res: string = await resMod.default({});
      parts.content = parts.content.replace(new RegExp(vText,'g'), res);
    }
    else if (vObj.type === 'include') {
        let res = Deno.readTextFileSync(varFileAbs);
        parts.content = parts.content.replace(new RegExp(vText,'g'), res);
    }
    else if (vObj.type === 'attach') {
      mdProcessed.attachments.push({absFile: varFileAbs, relFile:vObj.content});
      parts.content = parts.content.replace(new RegExp(vText,'g'), vObj.content);
    }
  }  // for content variables
  mdProcessed.content = parts.content;
  mdProcessed.html = marked(parts.content, null, null);

  return mdProcessed;
}


