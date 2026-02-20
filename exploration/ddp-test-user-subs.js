// Test various user subscription strategies to find what works
// Usage: node exploration/ddp-test-user-subs.js [userId]

const WebSocket = require('ws');
const TOKEN = 'nLsGXHZeaKrRYU3mDkRj8V74AqS-Ce6ZfcW4D12svIp';
const USER_ID = '57gTQAqa9uh2eW6af';

// One of the users from sentsList / flashesList
const TARGET_USER = process.argv[2] || 'xcFqJPeWnA9LGXCsy';

const ws = new WebSocket('wss://www.sboulder.com/sockjs/websocket', {
  headers: { Origin: 'https://www.sboulder.com', 'User-Agent': 'Mozilla/5.0' },
});

let msgId = 0;
const results = {};

function send(msg) {
  const str = JSON.stringify(msg);
  console.log('→', str);
  ws.send(str);
}

const SUBS_TO_TEST = [
  { name: 'users.single', params: [TARGET_USER] },
  { name: 'users.single', params: [{ userId: TARGET_USER }] },
  { name: 'user.single', params: [TARGET_USER] },
  { name: 'users.profile', params: [TARGET_USER] },
];

let subIndex = 0;

ws.on('open', () => send({ msg: 'connect', version: '1', support: ['1'] }));

ws.on('message', (raw) => {
  let msg;
  try { msg = JSON.parse(raw); } catch { return; }

  console.log('←', JSON.stringify(msg));

  if (msg.msg === 'connected') {
    send({ msg: 'method', method: 'login', params: [{ resume: TOKEN }], id: String(++msgId) });
  }

  if (msg.msg === 'result' && msg.result?.id === USER_ID) {
    console.log('\n✅ Logged in — testing subscriptions for user:', TARGET_USER, '\n');
    trySub();
  }

  if (msg.msg === 'ready') {
    const sub = SUBS_TO_TEST[subIndex - 1];
    console.log(`\n✅ SUB READY: "${sub.name}" params=${JSON.stringify(sub.params)}`);
    const users = {};
    // Dump result from msg
    results[sub.name] = 'ready';
  }

  if (msg.msg === 'nosub') {
    const sub = SUBS_TO_TEST[subIndex - 1];
    console.log(`\n❌ NOSUB: "${sub?.name}" reason:`, msg.error?.reason ?? '(no reason)');
    results[sub?.name ?? '?'] = `nosub: ${msg.error?.reason ?? 'undefined'}`;
    trySub();
  }

  if (msg.msg === 'added' && msg.collection === 'users') {
    console.log('\n👤 user added:', msg.id, JSON.stringify(msg.fields?.profile));
  }
});

function trySub() {
  if (subIndex >= SUBS_TO_TEST.length) {
    console.log('\n--- Results ---');
    console.log(results);
    ws.close();
    process.exit(0);
    return;
  }
  const sub = SUBS_TO_TEST[subIndex++];
  console.log(`\nTrying: "${sub.name}" with params:`, JSON.stringify(sub.params));
  send({ msg: 'sub', id: String(++msgId), name: sub.name, params: sub.params });
}

ws.on('error', (err) => { console.error('WS error:', err.message); process.exit(1); });
setTimeout(() => { console.log('\nTimeout — results:', results); ws.close(); process.exit(1); }, 20000);
