import {timeToRead} from './mod.ts';

const text = 'word '.repeat(180 * 1.5); 
let expected = { h: 0, m: 1, s: 30, min: 2 };
let result = timeToRead(text, 180);

Deno.test('time_to_read:1',()=>{
  if (JSON.stringify(expected) !== JSON.stringify(result)) throw new Error();
})



