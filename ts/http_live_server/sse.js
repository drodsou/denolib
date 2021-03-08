// Derived from: https://www.digitalocean.com/community/tutorials/nodejs-server-sent-events-build-realtime-app
// and: https://github.com/oakserver/oak/blob/main/server_sent_event.ts

export const sseClients = {};

// as php does

const createSSEPayload = (data)=>`HTTP/1.1 200 OK
Content-Type: text/event-stream;charset=UTF-8
Connection: keep-alive
Cache-Control: no-cache
data: ${data}` + '\n\n';

// test this with: curl -H Accept:text/event-stream http://localhost:8000/_sse

async function respondWithoutClosing(req, payload){
  const encoder = new TextEncoder();
  try {
    await req.w.write(encoder.encode(payload));
    await req.w.flush();
    return true;
  } catch (e) {
    return false;
  }
}

export async function sseHandleSubscription (req) {
  // Generate an id based on timestamp and save res
  // object of client connection on clients list
  // Later we'll iterate it and send updates to each client
  let clientId = Date.now();
  sseClients[clientId] = req;

  // need first message, ignored by client, but gets it ready for the real ones
  sseSendToOne(clientId, `Subscription ACK`);

  // When client closes connection we update the clients list
  // avoiding the disconnected one
  req.done.then(() => {
    console.log(`${clientId} SSE connection closed from client`);
    delete(sseClients[clientId]);
  });

}

export async function sseSendToOne(clientId, data) {
  console.log(`Sending message to client ${clientId}: ${data}`)
  let result = await respondWithoutClosing(sseClients[clientId], createSSEPayload(data));
  if (!result) {
    console.log('ERROR sending sse to client, autoclosing from server');
    delete(sseClients[clientId]);
  }
}

// Iterate clients list and use write res object method to send new nest
export async function sseSendToAll(data) {
  for (let clientId of Object.keys(sseClients)) {
    sseSendToOne(clientId, data);
  }
}