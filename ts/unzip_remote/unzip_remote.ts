import {runCmd} from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/run_cmd/mod.ts';

import {copyDirSyncFilter} from 'https://raw.githubusercontent.com/drodsou/denolib/master/ts/copy_dir_sync_filter/mod.ts';
// import {copyDirSyncFilter} from '../denolib/ts/copy_dir_sync_filter/mod.ts';

import * as path from "https://deno.land/std/path/mod.ts";
import {ensureDirSync} from 'https://deno.land/std/fs/ensure_dir.ts';


/** unzips remote (or local) zip file in destDir, optionally unziping only zipSubdir
*/
export async function unzipRemote (
  zipUrl:string, destDir:string, zipSubdir:string=''
) 
{
  const isWindows = !!Deno.env.get('WINDIR');

  // -- destDir
  let destDirAbsolute = path.isAbsolute ? destDir : path.join(Deno.cwd(), destDir);

  ensureDirSync(destDirAbsolute);
  
  if ([...Deno.readDirSync(destDir)].length !== 0) {
    throw new Error(`ERROR: Destination Dir must be empty: ${destDirAbsolute}`);
  };

  // -- create tmpDir ?
  let tmpDir='';
  if (zipSubdir || zipUrl.startsWith('http')) {
    tmpDir = Deno.makeTempDirSync({prefix: 'unzip_remote'});
  }

  // -- download zip file?
  let zipFile='';
  if (zipUrl.startsWith('http')) {
    // -- remote zip
    // TODO: stream this
    console.log('downloading zip');
    let zipFetch = await fetch(zipUrl);
    let zipBuffer = await zipFetch.arrayBuffer();
    zipFile = path.join(tmpDir, 'tmp.zip');
    Deno.writeFileSync(zipFile, new Uint8Array(zipBuffer) );
  } else {
    // -- local file
    zipFile = path.isAbsolute(zipUrl) ? zipUrl : path.join(Deno.cwd(), zipUrl);
  }

  // -- unzip
  console.log('uncompressing');

  let unzipDir = zipSubdir ? tmpDir : destDirAbsolute;

  let unzipResult;
  if (isWindows) {
    unzipResult = await runCmd (`powershell expand-archive ${zipFile} ${unzipDir}`)
  } else {
    unzipResult = await runCmd (`unzip ${zipFile} -d ${unzipDir}`)
  }
  if (!unzipResult.success) {
    throw new Error(`ERROR unzipping: ${unzipResult.output}`);
  }

  // -- copy subdir ?
  if (zipSubdir) {
    console.log('copying subfolder' );
    copyDirSyncFilter(path.join(tmpDir, zipSubdir), destDirAbsolute);
  }

  // -- clean tmp ?
  if (tmpDir) {
    console.log('cleaning tmp');
    Deno.removeSync(tmpDir, { recursive: true });
  }

  console.log('done');

}