
import readMdFile from './read_md_file.ts';
let __dirname = import.meta.url.split('/').slice(3,-1).join('/');

let refs = [
  {
    code: 'sagan-pale',
    desc: 'Pale blue dot',
  },
  {
    code: 'CarlSagan',
    desc: 'Carl Sagan',
    url: 'https://en.wikipedia.org/wiki/Carl_Sagan'
  }
]


const expected = {
  
  // -- test 
  'one': {
    frontmatter: {},
    content: "\nIn Pale blue dot p.54\n\nAs <a href=\"https://en.wikipedia.org/wiki/Carl_Sagan#UFOs\" target=\"_blank\" rel=\"noopener noreferrer\">Sagan</a> said\n\n## second point\n\npoint two\n",
    html: "<p>In Pale blue dot p.54</p>\n<p>As <a href=\"https://en.wikipedia.org/wiki/Carl_Sagan#UFOs\" target=\"_blank\" rel=\"noopener noreferrer\">Sagan</a> said</p>\n<h2 id=\"second-point\">second point</h2>\n<p>point two</p>\n",
    attachments: []
  },

  // -- test 
  'one-book': {
    frontmatter: {},
    content: "\nIn Pale blue dot [0] p.54\n\nAs <a href=\"https://en.wikipedia.org/wiki/Carl_Sagan#UFOs\" target=\"_blank\" rel=\"noopener noreferrer\">Sagan</a> [1] said\n\n## second point\n\npoint two\n",
    html: "<p>In Pale blue dot [0] p.54</p>\n<p>As <a href=\"https://en.wikipedia.org/wiki/Carl_Sagan#UFOs\" target=\"_blank\" rel=\"noopener noreferrer\">Sagan</a> [1] said</p>\n<h2 id=\"second-point\">second point</h2>\n<p>point two</p>\n",
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
        absFile: __dirname + '/testdata/image.jpg',
        relFile: 'image.jpg'
      },
      {
        absFile: __dirname + '/testdata/att.pdf',
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


Deno.test('read_md_file:ex1', async ()=>{
  let result = await readMdFile(__dirname + '/testdata/example1.md', false, {refs} );
  if (JSON.stringify(expected['one']) !== JSON.stringify(result)) {
    throw new Error();
  }
});

Deno.test('read_md_file:ex1-refnumber', async ()=>{
  let result = await readMdFile(__dirname + '/testdata/example1.md', false, {refs, refsNumbers:true} );
  if (JSON.stringify(expected['one-book']) !== JSON.stringify(result)) {
    throw new Error();
  }
});


Deno.test('read_md_file:ex2', async ()=>{
  let result = await readMdFile( __dirname  + '/testdata/example2.md');
  if (JSON.stringify(expected['two']) !== JSON.stringify(result)) {
    throw new Error();
  }
});

Deno.test('read_md_file:ex2-summary', async ()=>{
  let result = await readMdFile( __dirname  + '/testdata/example2.md', true);
  if (JSON.stringify(expected['two-summary']) !== JSON.stringify(result)) {
    throw new Error();
  }
});







