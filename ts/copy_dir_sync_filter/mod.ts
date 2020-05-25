

import {walkSync, WalkEntry} from 'https://deno.land/std/fs/walk.ts';
import {ensureDirSync} from 'https://deno.land/std/fs/ensure_dir.ts';


function slashPath (s:string) : string {
  return s.replace(/[\/\\]+/g,'/')
}

export function copyDirSyncFilter (
  src: string, 
  dest: string, 
  filter = (walkEntry:WalkEntry)=>true
  // options: CopyOptions = {},   // TODO use std/fs/copy.ts : copyFileSync instead of plain Deno.copyFileSync
): void 
{
  let slashSrc = slashPath(src);
  let slashDest = slashPath(dest);

  for (let walkEntry of walkSync(src)) {
    walkEntry.path = slashPath(walkEntry.path);
    if (filter && !filter(walkEntry)) { continue }

    let destPath = walkEntry.path.replace(src, dest);
    if (walkEntry.isDirectory) {
      //console.log('create', destPath)
      ensureDirSync(destPath);
    }

    if (walkEntry.isFile) { 
      //console.log('copy', walkEntry.path, destPath)
      Deno.copyFileSync(walkEntry.path, destPath);
    }
  }
}

// -- example
// copyDirSyncFilter('lib','kk', e=>e.path.includes('deno-') );

