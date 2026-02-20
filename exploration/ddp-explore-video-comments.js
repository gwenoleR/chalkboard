// Explore comment videoId format for a specific boulder
const WebSocket = require('ws');
const TOKEN = 'nLsGXHZeaKrRYU3mDkRj8V74AqS-Ce6ZfcW4D12svIp';
const USER_ID = '57gTQAqa9uh2eW6af';
const BOULDER_ID = process.argv[2] || 'jQy29Kri9QszWqZnz';

const ws = new WebSocket('wss://www.sboulder.com/sockjs/websocket', {
  headers: { Origin: 'https://www.sboulder.com', 'User-Agent': 'Mozilla/5.0' },
});
let msgId = 0;
const comments = {};
function send(msg) { ws.send(JSON.stringify(msg)); }

ws.on('open', () => send({ msg: 'connect', version: '1', support: ['1'] }));
ws.on('message', (raw) => {
  const msg = JSON.parse(raw);
  if (msg.msg === 'connected') send({ msg: 'method', method: 'login', params: [{ resume: TOKEN }], id: String(++msgId) });
  if (msg.msg === 'result' && msg.result?.id === USER_ID) {
    send({ msg: 'sub', id: String(++msgId), name: '_boulders.comments', params: [BOULDER_ID] });
  }
  if (msg.msg === 'added' && msg.collection === 'comments') comments[msg.id] = msg.fields;
});

setTimeout(() => {
  console.log(`Total comments: ${Object.keys(comments).length}`);
  Object.entries(comments).forEach(([id, f]) => {
    console.log(JSON.stringify({ id, videoId: f.videoId, videoSource: f.videoSource, text: f.text?.slice(0, 40) }, null, 2));
  });
  ws.close();
  process.exit(0);
}, 5000);
