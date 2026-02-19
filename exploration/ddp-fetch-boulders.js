// Fetch all boulders from a gym via DDP
// Usage: node exploration/ddp-fetch-boulders.js [gymId] [limit]
// Example: node exploration/ddp-fetch-boulders.js wattabloc
//          node exploration/ddp-fetch-boulders.js wattabloc/pans 50

const WebSocket = require('ws');
const TOKEN = 'nLsGXHZeaKrRYU3mDkRj8V74AqS-Ce6ZfcW4D12svIp';
const USER_ID = '57gTQAqa9uh2eW6af';

const GYM = process.argv[2] || 'wattabloc';
const LIMIT = parseInt(process.argv[3] || '500');

const ws = new WebSocket('wss://www.sboulder.com/sockjs/websocket', {
  headers: { Origin: 'https://www.sboulder.com', 'User-Agent': 'Mozilla/5.0' },
});

let msgId = 0;
const boulders = {};
let total = null;

function send(msg) {
  ws.send(JSON.stringify(msg));
}

// Selector for active boulders — isClosed must be null (not false) for open boulders
const SELECTOR = { gym: GYM, isClosed: null };
const SORT = { isClosed: 1, createdAt: -1, boulderNum: -1, label: -1, holdsColor: -1 };

ws.on('open', () => send({ msg: 'connect', version: '1', support: ['1'] }));

ws.on('message', (raw) => {
  let msg;
  try {
    msg = JSON.parse(raw);
  } catch {
    return;
  }

  if (msg.msg === 'connected') {
    send({ msg: 'method', method: 'login', params: [{ resume: TOKEN }], id: String(++msgId) });
  }

  if (msg.msg === 'result' && msg.result?.id === USER_ID) {
    console.log(`✅ Logged in — fetching boulders from "${GYM}" (limit: ${LIMIT})\n`);
    send({ msg: 'sub', id: String(++msgId), name: '_boulders.count', params: [SELECTOR] });
    send({
      msg: 'sub',
      id: String(++msgId),
      name: '_boulders.list',
      params: [SELECTOR, SORT, LIMIT, null],
    });
  }

  if (msg.msg === 'added') {
    if (msg.collection === 'boulders') {
      boulders[msg.id] = msg.fields;
    }
    if (msg.collection === 'counters-collection') {
      total = msg.fields.count;
    }
  }

  if (msg.msg === 'ready') {
    const n = Object.keys(boulders).length;
    // Only finalize when we have boulders data (count sub fires ready first)
    if (n > 0) {
      console.log(`📦 ${n} boulders received (total in gym: ${total ?? '?'})`);

      const all = Object.entries(boulders).map(([id, f]) => ({ _id: id, ...f }));

      // Summary
      const byLabel = {};
      all.forEach((b) => {
        byLabel[b.label] = (byLabel[b.label] || 0) + 1;
      });
      const sorted = Object.entries(byLabel).sort(([a], [b]) => Number(a) - Number(b));
      sorted.forEach(([label, count]) => console.log(`  Label ${label}: ${count} boulders`));

      console.log('\nSample boulder:');
      console.log(JSON.stringify(all[0], null, 2));

      ws.close();
      process.exit(0);
    }
  }

  if (msg.msg === 'nosub') {
    console.error('❌ nosub:', msg.error?.reason);
    ws.close();
    process.exit(1);
  }
});

ws.on('error', (err) => {
  console.error('WS error:', err.message);
  process.exit(1);
});

setTimeout(() => {
  console.error('Timeout — received', Object.keys(boulders).length, 'boulders');
  ws.close();
  process.exit(1);
}, 30000);
