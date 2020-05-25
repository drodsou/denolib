import {tokenize} from '../tokenize/mod.ts';

export async function runCmd (cmd:string, captureOutput=true) {
  let proc = Deno.run({
    cmd: tokenize(cmd),
    stdout: captureOutput ? 'piped' : 'inherit',
    stderr: captureOutput ? 'piped' : 'inherit',
  });
  
  let status = await proc.status();
  let output = '';
  
  if (captureOutput) {
    let rawOutput = await proc.output()
    let rawStderrOutput = await proc.stderrOutput();

    output = new TextDecoder().decode(rawOutput);
    output += '\n' + new TextDecoder().decode(rawStderrOutput);
  }
  
  proc.close();
  
  return {
    success: status.success,
    output: output
  }
}