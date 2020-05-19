import { slashJoin } from './mod.js';
// -- test 1
Deno.test('test1', () => {
    let res = slashJoin('/one/', '/two/', 'three', '/four', 'five/', '\\six\\', '\\seven', '\\eight');
    let expected = '/one/two/three/four/five/six/seven/eight';
    if (expected !== res)
        throw new Error();
});
// -- test 2
Deno.test('test2', () => {
    if (slashJoin() !== '')
        throw new Error();
});
