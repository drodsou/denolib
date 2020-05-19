
export type MdFrontmatter = {
  [key:string] : string  
}

export type MdVariables = {
  [key:string]: {
    type:string, 
    content:string 
  }
}    

export type MdParts = {
  frontmatter: MdFrontmatter,  
  content: string, 
  variables: MdVariables
}

/**
 * just splits string, no file read, no variable {{}} transformations done
*/
export default function mdParts (mdText: string): MdParts {
  
  // let frontmatterContent, mdContent;
  // let frontmatter = {};
  
  // -- divide frontmatter and content
  let frontmatterText ='';
  let frontmatterObj: MdFrontmatter = {};
  let contentText = '';

  let [ _, tmpFirst, ...tmpRest] = mdText.split('---');
  if (tmpRest.length) {
    frontmatterText = tmpFirst;
    contentText = tmpRest.join('---');
  } else {
    contentText = mdText;
  }


  // -- frontmatter to object
  if (frontmatterText) {
    frontmatterText.trim().split('\n').map(fmLine=>{
      let [key,value] : string[] = fmLine.split(':').map(fmLinePart=>fmLinePart.trim());
      frontmatterObj[key] = value;
    })
  }

  // -- content variables
  let mdVariables: MdVariables = {};  // ensure unique, even if used several times in context
  let varsArr = contentText.match(/({{[^}]*}})/g) || []; 
  for (let varText of varsArr) {
    let [varType, varContent] = varText.slice(2,-2).trim().split(':').map(x=>x.trim());  // {{img:x.jpg}}
    mdVariables[varText] = {type: varType, content: varContent };
  }

  return {frontmatter: frontmatterObj, content: contentText, variables: mdVariables};
 
}






