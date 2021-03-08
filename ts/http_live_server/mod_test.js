import {httpLiveServerStart, httpLiveServerReload} from './mod.js'

let count=0;
setInterval(()=>{
  count++;
  console.log('sending message', count);
  httpLiveServerReload(`message ${count}`);
},2000);
await httpLiveServerStart({path:'example', spa:false});

// // -- test 1
// Deno.test('slash_join:1',()=>{
//   let res = slashJoin('/one/','/two/', 'three', '/four', 'five/', '\\six\\', '\\seven', '\\eight');
//   let expected = '/one/two/three/four/five/six/seven/eight';
//   if (expected !== res) throw new Error();
// });



