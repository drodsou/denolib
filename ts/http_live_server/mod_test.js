import {httpLiveServerStart, httpLiveServerReload} from './mod.js'

setInterval(()=>{
  console.log('-- recarjando');
  httpLiveServerReload("recarjando!");
},1000);
await httpLiveServerStart({path:'example', spa:false});

// // -- test 1
// Deno.test('slash_join:1',()=>{
//   let res = slashJoin('/one/','/two/', 'three', '/four', 'five/', '\\six\\', '\\seven', '\\eight');
//   let expected = '/one/two/three/four/five/six/seven/eight';
//   if (expected !== res) throw new Error();
// });



