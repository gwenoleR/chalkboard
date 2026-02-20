const WebSocket = require('ws');
const TOKEN = 'nLsGXHZeaKrRYU3mDkRj8V74AqS-Ce6ZfcW4D12svIp';

const ws = new WebSocket('wss://www.sboulder.com/sockjs/websocket', {
  headers: { Origin: 'https://www.sboulder.com', 'User-Agent': 'Mozilla/5.0' },
});

let msgId = 0;
const gyms = {};

function send(msg) { ws.send(JSON.stringify(msg)); }

ws.on('open', () => {
  console.log('open');
  send({ msg: 'connect', version: '1', support: ['1'] });
});

ws.on('message', (raw) => {
  const text = raw.toString();
  console.log('raw:', text.slice(0, 120));
  let msg;
  try { msg = JSON.parse(text); } catch { return; }

  if (msg.msg === 'connected') {
    console.log('connected, logging in');
    send({ msg: 'method', method: 'login', params: [{ resume: TOKEN }], id: String(++msgId) });
  }
  if (msg.msg === 'result' && msg.result?.id) {
    console.log('logged in as', msg.result.id);
    send({ msg: 'sub', id: String(++msgId), name: '_gyms.list', params: [{}] });
  }
  if (msg.msg === 'added' && msg.collection === 'gyms') {
    gyms[msg.id] = { name: msg.fields?.name, city: msg.fields?.city };
  }
});

ws.on('error', (e) => console.error('error', e.message));

setTimeout(() => {
  console.log('Total gyms:', Object.keys(gyms).length);
  ws.close();
}, 6000);
