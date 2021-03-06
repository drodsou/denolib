import { serve } from "https://deno.land/std/http/server.ts";
import { serveFile } from "https://deno.land/std/http/file_server.ts";
import {yellow as colorYellow, red as colorRed, green as colorGreen} from 'https://deno.land/std/fmt/colors.ts';
import {sseHandleSubscription, sseSendToAll, sseClients} from './sse.js';

const defaultOpts = {
  port: 8000,
  liveReload: true,
  spa: true,
  path: slashJoin(Deno.cwd()),
  debug: false,
  proxy: {route: '/php', server: 'http//:localhost:8002'}
}

const SSE_URL = '/_sse';

let opts

export function httpLiveServerReload (files) {
  sseSendToAll(files)
}

export async function httpLiveServerStart (userOpts) {
  opts = {...defaultOpts, ...userOpts}
  opts.path =  isAbsPath(opts.path) ? opts.path : slashJoin(Deno.cwd() + '/' + opts.path);

  logGreen(`Serving path: ${opts.path}`);

  const server = serve({ port: opts.port });
  logGreen(`Serving url: http://localhost:${opts.port}/`);

  for await (const req of server) {
    
    if (opts.proxy && req.url === opts.proxy.route) {
      //logDebug('Subscription to SSE received from browser');
      sseHandleSubscription(req);
      continue;
    }

    if (req.method !== 'GET') {
      logRed('Request method not allowed', req.method);
      req.respond({status: 405})
      continue;
    }

    if (req.url === SSE_URL) {
      //logDebug('Subscription to SSE received from browser');
      sseHandleSubscription(req);
      continue;
    }

    logGreen(`GET: ${req.url}`)


    let reqPath = opts.path + req.url.split('#')[0].split('?')[0];
    logDebug(`reqPath: ${reqPath}`)
    let stat = await pathStat(reqPath);

    if (stat === 'dir') { 
      logDebug('req is dir, trying its index.html')
      reqPath = slashJoin(reqPath, '/index.html');
      stat = await pathStat(reqPath);
    }

    const requestingAFile = reqPath.includes('.');
    if (stat === 'not found' && opts.spa && !requestingAFile) {
      logDebug('req not found, but SPA enabled, trying /index.html')
      reqPath = slashJoin(opts.path, '/index.html');
      stat = await pathStat(reqPath);
    }

    if (stat === 'file') { 
      logDebug('ok: sending file')
      sendFile(req, reqPath); 
      continue;
    }

    logRed('not found:', reqPath)
    req.respond({status: 404})
  }
}

// -- HELPERS


async function sendFile(req, reqPath) {
  const res = await serveFile(req, reqPath);
  
  if (opts.liveReload && reqPath.endsWith('.html') ) {
    const decoder = new TextDecoder('utf-8');
    const html = decoder.decode(await Deno.readAll(res.body));
    const lrHtml = addLiveReload(html);
    let finalHtml;
    if (!lrHtml) {
      logRed(`Could not add liveReload script to ${reqPath}, the file doesn't have a </body> tag.`);
      finalHtml = html;
    } else {
      finalHtml = lrHtml;
    }
    const finalHtmlBytes = new TextEncoder().encode(finalHtml);
    res.body = finalHtmlBytes;
    res.headers.set('content-length', finalHtmlBytes.length);
  }

  req.respond(res);
}

async function pathStat(path) {
  try {
    let stat = await Deno.stat(path);
    if (stat.isFile) return 'file';
    if (stat.isDirectory) return 'dir';
  }
  catch (e) { true }
  return 'not found';
}


function addLiveReload (html) {
  let endBodyTag = ((html||'').match(/<\/body>/i)||[])[0];
  if (!endBodyTag) {
    return false;
  }
  logDebug('endBodyTag', endBodyTag)
  return html.replace(endBodyTag,`
  <script>
    console.log('autoreload enabled');
    let source = new EventSource("/_sse");
    source.onmessage = function(event) {
      console.log("SSE received: " + (event.data||'').slice(0,15) + "..." );
      eval(event.data);
    };
  </script>
  </body>
  `);
}



// -- HELPER GENERIC

function logDebug(...str) {
  if (opts.debug) console.log(colorYellow(`HTTP: debug: ${str.join(' ')}`))
}

function logRed(...str) {
  console.log(colorRed(`HTTP: ${str.join(' ')}`));
}

function logGreen(...str) {
  console.log(colorGreen(`HTTP: ${str.join(' ')}`));
}



function slashJoin (...args) {
  return args.join('/').replace(/[\/\\]+/g,'/');
}

function isAbsPath(str='') {
  if (str.startsWith('/') || str[1] === ':') {
    return true
  } 
  return false;
}