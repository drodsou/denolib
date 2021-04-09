import {unindent} from './mod.ts'



Deno.test('unindent 1',()=>{
  let res = unindent(`
    Something I want unindented
      but in block,
      not each line
  `);
  let expected = `Something I want unindented\n  but in block,\n  not each line`;
  if (expected !== res) {
    console.log('\n' + res)
    console.log(expected)
    throw new Error();
  }
});


Deno.test('unindent 2',()=>{
  let res = unindent(`do not remove first line\n  ok\n`);
  let expected = `do not remove first line\n  ok`;
  if (expected !== res) {
    console.log('\n' + res)
    console.log(expected)
    throw new Error();
  }
});




