import {getFileDate} from './mod.ts';

let __dirname = import.meta.url.split('/').slice(3,-1).join('/');

Deno.test('get_file_date:1',()=>{
  if (!(getFileDate(__dirname + './mod.ts') instanceof Date)) {
    throw new Error();
  }
});

Deno.test('get_file_date:2',()=>{
  if (getFileDate('X') !== undefined) {
    throw new Error();
  }
});
