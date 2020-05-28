import * as path from "https://deno.land/std/path/mod.ts";
import {slashJoin} from '../slash_join/mod.ts';

/** give a file referenced in parentFile with relative path, return absolute path of file */
export function getAbsoluteFile(file:string, parentFile:string) {
  let fileAbs = path.isAbsolute(file) 
    ? file
    : slashJoin( path.resolve(path.dirname(parentFile)), file);

  try {
    Deno.statSync(fileAbs)
  } catch (e) {
    throw new Error(`Cannot find referenced file '${fileAbs}', in file '${parentFile}'`);
  }

  return fileAbs;
}