
export type MdFrontmatter = {
  [key:string] : string  
}

export type MdParts = {
  frontmatter: MdFrontmatter,  
  content: string
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

  return {frontmatter: frontmatterObj, content: contentText};
 
}






