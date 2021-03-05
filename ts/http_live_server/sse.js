// Derived from: https://www.digitalocean.com/community/tutorials/nodejs-server-sent-events-build-realtime-app
// and: https://github.com/oakserver/oak/blob/main/server_sent_event.ts

export const sseClients = {all:[]};

// as php does
let count = 1;
let msg1 = "The server time is: Fri, 05 Mar 2021 23:11:54 +0100";
let payload = (msg)=>`HTTP/1.1 200 OK
Date: Fri, 05 Mar 2021 22:11:54 GMT
Content-Type: text/event-stream;charset=UTF-8
Transfer-Encoding: chunked
Connection: keep-alive
Cache-Control: no-cache
Vary: Accept-Encoding
Age: 0
Server: HTTPd
Accept-Ranges: bytes

3b
data: ${msg}


0

`;

async function respondWithoutClosing(req, payload){
  const encoder = new TextEncoder();
  await req.w.write(encoder.encode(payload));
  //await req.w.flush();
}

export async function sseHandleSubscription (req) {
  // Mandatory headers and http status to keep connection open
  const headers = new Headers();




  // let firstPayload = [
  //   "HTTP/1.1 200 OK",
  //   "Content-Type: text/event-stream",
  //   "Connection: keep-alive",
  //   "Cache-Control: no-cache",
  //   `Keep-Alive: timeout=${Number.MAX_SAFE_INTEGER}`,
  //   `{"data":"sse ok"}`,
  // ].join('\n');

  // req.respond closes connection
  // respondWithoutClosing(req, payload(msg1));
  respondWithoutClosing(req, payload(String(count++)));
  

  // Generate an id based on timestamp and save res
  // object of client connection on clients list
  // Later we'll iterate it and send updates to each client

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    req
  };
  sseClients.all.push(newClient);

  // When client closes connection we update the clients list
  // avoiding the disconnected one
  req.done.then(() => {
    console.log(`${clientId} Connection closed`);
    sseClients.all = sseClients.all.filter(c => c.id !== clientId);
  });

}


// Iterate clients list and use write res object method to send new nest
export function sseSendToAll(data) {
  sseClients.all.forEach(c => respondWithoutClosing(
    c.req,
    payload(String(count++))
    // `{"data": ${JSON.stringify(data)}}`
    // `data: ${JSON.stringify(data)}`
  ));
}