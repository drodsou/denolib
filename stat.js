let r = await Deno.stat('lREADME.md').catch(e=>e);


console.log(typeof r, r.isDirectory); 
