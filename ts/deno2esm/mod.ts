import {walkSync, WalkEntry} from 'https://deno.land/std/fs/walk.ts';
import {ensureDirSync} from 'https://deno.land/std/fs/ensure_dir.ts';
import {slashJoin} from '../slash_join/mod.ts';
  
/** */
export async function deno2esm (
  src: string, 
  dest: string, 
  filter?: (walkEntry:WalkEntry)=>boolean
  // options: CopyOptions = {},   // TODO use std/fs/copy.ts : copyFileSync instead of plain Deno.copyFileSync
): Promise<void>
{

  let slashSrc = slashJoin(src);
  let slashDest = slashJoin(dest);

  for (let walkEntry of walkSync(src)) {
    walkEntry.path = slashJoin(walkEntry.path);

    if (filter && !filter(walkEntry)) { continue }

    let destPath = walkEntry.path.replace(src, dest).replace('.ts','.js');

    if (walkEntry.isDirectory) {
      ensureDirSync(destPath);
    }

    if (walkEntry.isFile) { 
      let sourceContent = Deno.readTextFileSync(walkEntry.path);
      
      let transpiled = await Deno.transpileOnly(
        {"_": sourceContent },
        {sourceMap:false}
      );
      let destContent = transpiled['_'].source.replace(/\.ts(["'])/g,'.js$1');

      Deno.writeTextFileSync(destPath, destContent);
    }
  }
}

/** direct run, not import 
 * must be called with --unstable flag as of Deno 1.0
*/
if (import.meta.main) {
  deno2esm(Deno.args[0], Deno.args[1]);
}
