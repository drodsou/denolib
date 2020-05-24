import {runCmd} from './mod.ts';

Deno.test('run_cmd:1', async ()=>{
  let res = await runCmd('deno --version');
  if (!res.success || !res.output.startsWith('deno ')) {
    throw new Error('');
  }
});


