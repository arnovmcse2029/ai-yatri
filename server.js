const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg'
};

function sendJson(res, status, body){
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify(body));
}

function readBody(req){
  return new Promise((resolve, reject)=>{
    let body = '';
    req.on('data', chunk=>{
      body += chunk;
      if (body.length > 1_000_000) reject(new Error('Request too large'));
    });
    req.on('end', ()=>resolve(body));
    req.on('error', reject);
  });
}

async function handleChat(req, res){
  if (!API_KEY){
    sendJson(res, 503, {error:'Set ANTHROPIC_API_KEY before starting the server.'});
    return;
  }
  try {
    const input = JSON.parse(await readBody(req));
    const messages = Array.isArray(input.messages) ? input.messages : [];
    const persona = input.persona || {};
    if (!messages.length) throw new Error('A chat message is required');

    const system = `You are Traveller Chat inside AI Yatri, a helpful India travel assistant. Answer the traveller naturally, like a thoughtful ChatGPT conversation. Give specific, practical suggestions and ask one useful follow-up question when needed. Do not claim live prices, bookings, opening hours, or safety conditions unless provided; label uncertain details as approximate. Keep replies under 120 words. Traveller profile: ${JSON.stringify(persona)}`;
    const apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'x-api-key':API_KEY,
        'anthropic-version':'2023-06-01',
        'anthropic-dangerous-direct-browser-access':'false'
      },
      body:JSON.stringify({model:MODEL, max_tokens:350, system, messages})
    });
    const data = await apiResponse.json();
    if (!apiResponse.ok) throw new Error(data.error?.message || 'Anthropic request failed');
    const text = (data.content || []).find(block=>block.type==='text')?.text?.trim();
    if (!text) throw new Error('AI returned an empty response');
    sendJson(res, 200, {reply:text});
  } catch(error){
    sendJson(res, 500, {error:error.message});
  }
}

function serveFile(req, res){
  const requested = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
  const relative = requested === '/' ? 'ai-yatri.html' : requested.replace(/^\/+/, '');
  const filePath = path.resolve(ROOT, relative);
  if (!filePath.startsWith(ROOT + path.sep) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()){
    res.writeHead(404); res.end('Not found'); return;
  }
  if (path.basename(filePath) === 'ai-yatri.html'){
    let html = fs.readFileSync(filePath, 'utf8');
    if (process.env.GOOGLE_MAPS_API_KEY) html = html.replace("const GOOGLE_MAPS_API_KEY = '';", `const GOOGLE_MAPS_API_KEY = ${JSON.stringify(process.env.GOOGLE_MAPS_API_KEY)};`);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.end(html);
    return;
  }
  res.writeHead(200, {'Content-Type':MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream'});
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res)=>{
  if (req.method === 'OPTIONS'){
    res.writeHead(204, {'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Headers':'Content-Type'});
    res.end();
    return;
  }
  if (req.method === 'POST' && req.url === '/api/chat') return handleChat(req, res);
  if (req.method === 'GET') return serveFile(req, res);
  sendJson(res, 405, {error:'Method not allowed'});
});

server.listen(PORT, ()=>console.log(`AI Yatri running at http://localhost:${PORT}`));
