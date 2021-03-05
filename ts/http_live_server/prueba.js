async function pathStat(path) {
  try {
    let stat = await Deno.stat(path);
    if (stat.isFile) return 'file';
    if (stat.isDirectory) return 'dir';
  }
  catch (e) { true }
  return 'not found';
}

console.dir( await pathStat(Deno.cwd() + '/example/' ))

