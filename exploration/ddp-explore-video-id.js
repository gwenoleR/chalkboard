// Check videoId fields on boulder and comments for jQy29Kri9QszWqZnz
const WebSocket = require('ws');
const TOKEN = 'nLsGXHZeaKrRYU3mDkRj8V74AqS-Ce6ZfcW4D12svIp';
const USER_ID = '57gTQAqa9uh2eW6af';
const BOULDER_ID = 'jQy29Kri9QszWqZnz';

const ws = new WebSocket('wss://www.sboulder.com/sockjs/websocket', {
  headers: { Origin: 'https://www.sboulder.com', 'User-Agent': 'Mozilla/5.0' },
});
let msgId = 0;
const collections = {};
function send(msg) { ws.send(JSON.stringify(msg)); }

ws.on('open', () => send({ msg: 'connect', version: '1', support: ['1'] }));
ws.on('message', (raw) => {
  const msg = JSON.parse(raw);
  if (msg.msg === 'connected') send({ msg: 'method', method: 'login', params: [{ resume: TOKEN }], id: String(++msgId) });
  if (msg.msg === 'result' && msg.result?.id === USER_ID) {
    send({ msg: 'sub', id: String(++msgId), name: 'access-points', params: ['wattabloc'] });
    send({ msg: 'sub', id: String(++msgId), name: '_boulders.comments', params: [BOULDER_ID] });
  }
  if (msg.msg === 'added') {
    if (!collections[msg.collection]) collections[msg.collection] = {};
    collections[msg.collection][msg.id] = msg.fields;
  }
});

setTimeout(() => {
  // Boulder fields
  const boulder = collections['boulders']?.[BOULDER_ID];
  console.log('Boulder videoId:', boulder?.videoId, 'videosCount:', boulder?.videosCount);

  // All comment fields (full dump)
  const comments = collections['comments'] || {};
  Object.entries(comments).forEach(([id, f]) => {
    console.log('\nComment', id);
    console.log(JSON.stringify(f, null, 2));
  });

  ws.close(); process.exit(0);
}, 5000);
