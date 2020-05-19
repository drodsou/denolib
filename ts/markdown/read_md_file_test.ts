
import readMdFile from './read_md_file.ts';
let __dirname = import.meta.url.split('/').slice(3,-1).join('/');

const expected = {
  
  // -- test 
  'one': {
    frontmatter: {},
    content: '\nSimple as it is\n\n## first point\n\ntext of first point\n',
    html: '<p>Simple as it is</p>\n' +
      '<h2 id="first-point">first point</h2>\n' +
      '<p>text of first point</p>\n',
    attachments: []
  },

  // -- test 
  'two': {
    frontmatter: { title: 'the title', date: '1900-01-15' },
    content: '\n' +
      '\n' +
      '<img src="image.jpg" alt="alt text">\n' +
      '\n' +
      'Some intro with a subrepticious --- over here\n' +
      '\n' +
      '## first point\n' +
      '\n' +
      'text of first point\n' +
      '\n' +
      '```js\n' +
      'function codeSample () {\n' +
      '  return true;\n' +
      '}\n' +
      '```\n' +
      '\n' +
      '## second point\n' +
      '\n' +
      'The winer number today has been:\n' +
      '\n' +
      '<strong>\n' +
      '  something <b>fetched</b> from somewhere\n' +
      '</strong>\n' +
      '\n' +
      '## third point\n' +
      '\n' +
      '<a src="att.pdf">Download this file</a>\n' +
      '\n' +
      '\n' +
      '\n' +
      '\n',
    html: '<img src="image.jpg" alt="alt text">\n' +
      '\n' +
      '<p>Some intro with a subrepticious --- over here</p>\n' +
      '<h2 id="first-point">first point</h2>\n' +
      '<p>text of first point</p>\n' +
      '<pre><code class="language-js">function codeSample () {\n' +
      '  return true;\n' +
      '}</code></pre>\n' +
      '<h2 id="second-point">second point</h2>\n' +
      '<p>The winer number today has been:</p>\n' +
      '<strong>\n' +
      '  something <b>fetched</b> from somewhere\n' +
      '</strong>\n' +
      '\n' +
      '<h2 id="third-point">third point</h2>\n' +
      '<p><a src="att.pdf">Download this file</a></p>\n',
    attachments: [
      {
        absFile: __dirname + '/test/image.jpg',
        relFile: 'image.jpg'
      },
      {
        absFile: __dirname + '/test/att.pdf',
        relFile: 'att.pdf'
      }
    ]
  },

  // -- test

  'two-summary': {
    frontmatter: { title: 'the title', date: '1900-01-15' },
    content: '',
    html: '',
    attachments: []
  }
}


Deno.test('one', async ()=>{
  let result = await readMdFile(__dirname + '/test/example1.md');
  if (JSON.stringify(expected['one']) !== JSON.stringify(result)) {
    throw new Error();
  }
});


Deno.test('two', async ()=>{
  let result = await readMdFile( __dirname  + '/test/example2.md');
  if (JSON.stringify(expected['two']) !== JSON.stringify(result)) {
    throw new Error();
  }
});

Deno.test('two-summary', async ()=>{
  let result = await readMdFile( __dirname  + '/test/example2.md', true);
  if (JSON.stringify(expected['two-summary']) !== JSON.stringify(result)) {
    throw new Error();
  }
});







