import mdParts from './md_parts.ts';

let input = `
---
frontVar1: frontVar1Value
frontVar2: frontVar2Value
---
content1 
{{var1type:var1content}} content 3 {{var2type:var2content}}  
content3 --- content4
`;

let expected = {
  frontmatter: { 
    frontVar1: 'frontVar1Value', 
    frontVar2: 'frontVar2Value' 
  },
  content: '\n' +
    'content1 \n' +
    '{{var1type:var1content}} content 3 {{var2type:var2content}}  \n' +
    'content3 --- content4\n',
  variables: {
    '{{var1type:var1content}}': { type: 'var1type', content: 'var1content' },
    '{{var2type:var2content}}': { type: 'var2type', content: 'var2content' }
  }
}

let result = mdParts(input);

// console.log(expected);
// console.log(result);

Deno.test('mdparts',()=>{
  if ( JSON.stringify(result) !== JSON.stringify(expected)) throw new Error('Test failed');
});



