
/** */
export function getFileDate(file:string): Date | undefined {
  let fileDate;
  try {
    fileDate = Deno.statSync(file).mtime || new Date();
  } catch (e) {}
  return fileDate;
}
