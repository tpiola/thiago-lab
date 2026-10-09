import { IncomingMessage } from 'node:http';
import { Socket } from 'node:net';
import { Writable } from 'node:stream';
import connect from 'connect';
import { installHostedProviders } from 'gods-eye-view/hosted-providers';

export const runtime = 'nodejs';
export const maxDuration = 60;
const middleware = connect();
installHostedProviders(middleware);
const MAX_BODY = 1024 * 1024;
const MAX_RESPONSE = 20 * 1024 * 1024;

class ProviderResponse extends Writable {
  constructor() {
    super();
    this.statusCode = 200;
    this.headersSent = false;
    this.headers = new Map();
    this.chunks = [];
    this.bytes = 0;
  }
  setHeader(name, value) { this.headers.set(name.toLowerCase(), String(value)); return this; }
  getHeader(name) { return this.headers.get(name.toLowerCase()); }
  removeHeader(name) { this.headers.delete(name.toLowerCase()); }
  writeHead(status, reason, headers) {
    this.statusCode = status;
    for (const [name, value] of Object.entries(headers || (typeof reason === 'object' ? reason : {}))) this.setHeader(name, value);
    this.headersSent = true;
    return this;
  }
  _write(chunk, _encoding, callback) {
    this.headersSent = true;
    this.bytes += chunk.length;
    if (this.bytes > MAX_RESPONSE) { callback(new Error('Response too large')); return; }
    this.chunks.push(Buffer.from(chunk));
    callback();
  }
  toResponse(method) {
    let body = Buffer.concat(this.chunks);
    if (String(this.getHeader('content-type')).includes('json')) {
      body = Buffer.from(body.toString('utf8').replace(/"\/api\//g, '"/api/gods-eye-view/'));
      this.headers.delete('content-length');
    }
    return new Response(method === 'HEAD' ? null : body, { status: this.statusCode, headers: Object.fromEntries(this.headers) });
  }
}

async function handle(request) {
  if (request.headers.get('sec-fetch-site') === 'cross-site') return Response.json({ error: 'Same-origin requests only' }, { status: 403 });
  if (Number(request.headers.get('content-length')) > MAX_BODY) return Response.json({ error: 'Request too large' }, { status: 413 });
  const incoming = new IncomingMessage(new Socket());
  const url = new URL(request.url);
  incoming.url = url.pathname.replace(/^\/api\/gods-eye-view\//, '/api/') + url.search;
  incoming.method = request.method;
  incoming.headers = Object.fromEntries(request.headers);
  // Consume request bodies under a fixed cap before passing native provider middleware.
  const reader = request.body?.getReader();
  let bytes = 0;
  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY) { await reader.cancel(); return Response.json({ error: 'Request too large' }, { status: 413 }); }
      incoming.push(Buffer.from(value));
    }
  }
  incoming.push(null);
  const response = new ProviderResponse();
  try {
    await new Promise((resolve, reject) => {
      response.once('finish', resolve);
      response.once('error', reject);
      middleware(incoming, response, (error) => {
        if (error) reject(error);
        else { response.writeHead(404, { 'Content-Type': 'application/json' }); response.end(JSON.stringify({ error: 'Provider not found' })); }
      });
    });
    return response.toResponse(request.method);
  } catch {
    return Response.json({ error: 'Provider unavailable' }, { status: 502 });
  }
}

export { handle as GET, handle as POST, handle as HEAD };
