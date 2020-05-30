if (import.meta.main) {
  reorderFolder( Deno.args[0], parseInt(Deno.args[1])||undefined );
}

/**
 * reorder files/directories of folder assigning correlative 01. prefix
 * useful for writing markdown books to reorder sections inside chapters, or chapters 
 * install: deno install -f --allow-read --allow-write https://raw.githubusercontent.com/drodsou/denolib/master/ts/slash_join/reorder_folder.ts
*/
export function reorderFolder(folder:string, padWidth=2) {
  if (!folder) { folder = Deno.cwd(); }
  if (folder.startsWith(".")) {
    folder = Deno.cwd() + folder.slice(1);
  }
  folder = folder.replace(/[\/\\]$/,'');

  let files = [...Deno.readDirSync(folder)].map(e=>e.name);

  files.forEach( (f,i)=>{
    let curIndex = f.split('.')[0];
    let newIndex = `${i+1}`.padStart(padWidth,"0");
    
    if (newIndex !== curIndex) {
      let newFile = newIndex + '.' + f.replace(/[^\.]+\./,"");
      Deno.renameSync(folder + '/' + f, folder + '/' + newFile);
    }
  })
}
