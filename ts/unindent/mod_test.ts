import {unindent} from './mod.ts'


// -- test 1
Deno.test('unindent',()=>{
  let res = unindent(`
    Something I want unindented
      but in block,
      not each line
  `);
  let expected = `Something I want unindented\n  but in block,\n  not each line`;
  // console.log('\n[',res,']')
  // console.log('[',expected,']')
  if (expected !== res) throw new Error();
});




