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
 *   'run:' executes .js script and replaces variable with result;
 *   'inc:' replaces variable with content of file;
 *   'att:' replaces variable with varible content, and adds it to 'attachments';
 */
export default async function readMdFile 
  (file:string, summaryOnly?: boolean) : Promise<MdProcessed>
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

  // -- process content variables
  for (let [k,v] of Object.entries(parts.variables)) {
    if (!['run','include','attach','props'].includes(v.type) ) {
      console.log(colorRed(`Unknown variable type '${v.type}'`));
      console.log(colorRed(`in markdown file '${file}'`));
      Deno.exit(1);
    }

    // -- absolutize paths
    let varFileAbs = path.isAbsolute(v.content) 
      ? v.content
      : slashJoin( path.resolve(path.dirname(file)), v.content);
    

    try {
      Deno.statSync(varFileAbs)
    } catch (e) {
      console.log(colorRed(`Cannot find referenced file '${varFileAbs}'`));
      console.log(colorRed(`in markdown file '${file}'`));
      Deno.exit(1);
    }

    // -- var types
    if (v.type === 'run') {
      let resMod = await import(varFileAbs.replace(/^[a-zA-Z]:/,''));  // remove C: if exists, deno import bug
      let res: string = await resMod.default({});
      parts.content = parts.content.replace(new RegExp(k,'g'), res);
    }
    else if (v.type === 'inc') {
        let res = Deno.readTextFileSync(varFileAbs);
        parts.content = parts.content.replace(new RegExp(k,'g'), res);
    }
    else if (v.type === 'att') {
      mdProcessed.attachments.push({absFile: varFileAbs, relFile:v.content});
      parts.content = parts.content.replace(new RegExp(k,'g'), v.content);
    }
  }  // for content variables
  mdProcessed.content = parts.content;
  mdProcessed.html = marked(parts.content, null, null);

  return mdProcessed;
}


