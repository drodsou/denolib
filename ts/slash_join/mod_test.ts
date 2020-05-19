import {slashJoin} from './mod.ts'


// -- test 1
Deno.test('slash_join:1',()=>{
  let res = slashJoin('/one/','/two/', 'three', '/four', 'five/', '\\six\\', '\\seven', '\\eight');
  let expected = '/one/two/three/four/five/six/seven/eight';
  if (expected !== res) throw new Error();
});


// -- test 2
Deno.test('slash_join:2',()=>{
  if (slashJoin() !== '') throw new Error();
})



