
/**
drop in replacemente for 'path.join' but normalicing to '/' separator even in windows.
*/
export function slashJoin (...args: string[]) {
  return args.join('/').replace(/[\/\\]+/g,'/');
}