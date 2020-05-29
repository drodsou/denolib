import {runCmd} from '../run_cmd/mod.ts';
import {copyDirSyncFilter} from '../copy_dir_sync_filter/mod.ts';

import * as path from "https://deno.land/std/path/mod.ts";
import {ensureDirSync} from 'https://deno.land/std/fs/ensure_dir.ts';

let errFmt = (str:string)=>'\n\n' + '-'.repeat(30) + '\n' + str + '\n' + '-'.repeat(30) + '\n';

/** unzips remote (or local) zip file in destDir, optionally unziping only zipSubdir
 *   example: deno run -A unzip_remote.ts https://github.com/drodsou/mdbookgen/archive/master.zip testdata mdbookgen-master/example-book
*/
export async function unzipRemote (
  zipUrl:string, destDir:string, zipSubdir:string=''
) 
{
  const isWindows = !!Deno.env.get('WINDIR');

  // -- destDir
  let destDirAbsolute = path.isAbsolute(destDir) ? destDir : path.join(Deno.cwd(), destDir);

  ensureDirSync(destDirAbsolute);
  
  if ([...Deno.readDirSync(destDir)].length !== 0) {
    throw new Error(errFmt(`ERROR: Destination directory must be empty: ${destDirAbsolute}`));
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
    throw new Error(errFmt(`ERROR unzipping: ${unzipResult.output}`));
  }

  // -- copy subdir ?
  if (zipSubdir) {
    let zipSubdirAbsolute = path.join(tmpDir, zipSubdir)
    // console.log('copying subfolder',zipSubdirAbsolute, destDirAbsolute  );
    console.log('copying zip subfolder',zipSubdir, 'to', destDirAbsolute );
    let zipSubdirExists = (await Deno.stat(zipSubdirAbsolute).catch(e=>e)).isDirectory;
    if (!zipSubdirExists) {
      Deno.removeSync(tmpDir, { recursive: true });
      throw new Error(errFmt(`ERROR: Directory '${zipSubdir}' does not exist in zip file.`));
    }
    copyDirSyncFilter(path.join(tmpDir, zipSubdir), destDirAbsolute);
  }

  // -- clean tmp ?
  if (tmpDir) {
    console.log('cleaning tmp');
    Deno.removeSync(tmpDir, { recursive: true });
  }

  console.log('done');

}


// -- MAIN
if (import.meta.main) {
  let help = `unzip_remote zipUrl destDir [zipSubdir] `;

  if (Deno.args[0] === '--help') { 
    console.log(help);
  }

  let [zipUrl, destDir, zipSubdir] = Deno.args;
  if (!zipUrl || !destDir) {
    console.log(`ERROR: Mandatory zipUrl and destDir\n\n${help}`);
  }
  await unzipRemote(zipUrl, destDir, zipSubdir);
}