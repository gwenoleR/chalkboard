// Explore subscriptions available for boulder detail (comments, photos, videos)
// Usage: node exploration/ddp-explore-boulder-detail.js [boulderId]
// Gets a boulder ID from the list first, then tries various subs

const WebSocket = require('ws');
const TOKEN = 'nLsGXHZeaKrRYU3mDkRj8V74AqS-Ce6ZfcW4D12svIp';
const USER_ID = '57gTQAqa9uh2eW6af';
const GYM = 'wattabloc';

const ws = new WebSocket('wss://www.sboulder.com/sockjs/websocket', {
  headers: { Origin: 'https://www.sboulder.com', 'User-Agent': 'Mozilla/5.0' },
});

let msgId = 0;
const collections = {};
let targetBoulderId = process.argv[2] || null;
let subIndex = 0;
let subsToTest = [];

function send(msg) {
  ws.send(JSON.stringify(msg));
}

ws.on('open', () => send({ msg: 'connect', version: '1', support: ['1'] }));

ws.on('message', (raw) => {
  let msg;
  try { msg = JSON.parse(raw); } catch { return; }

  if (msg.msg === 'connected') {
    send({ msg: 'method', method: 'login', params: [{ resume: TOKEN }], id: String(++msgId) });
  }

  if (msg.msg === 'result' && msg.result?.id === USER_ID) {
    console.log('✅ Logged in\n');
    if (targetBoulderId) {
      startTesting(targetBoulderId);
    } else {
      // Get a boulder ID first
      send({
        msg: 'sub', id: String(++msgId), name: '_boulders.list',
        params: [{ gym: GYM, isClosed: null }, { createdAt: -1 }, 1, null],
      });
    }
  }

  if (msg.msg === 'added') {
    const col = msg.collection;
    if (!collections[col]) collections[col] = {};
    collections[col][msg.id] = msg.fields;

    if (col === 'boulders' && !targetBoulderId) {
      targetBoulderId = msg.id;
      console.log(`📍 Using boulder: ${targetBoulderId} (${msg.fields?.grade} - ${msg.fields?.gym})\n`);
    }

    // Log anything we receive that's not boulders/gyms/counters
    if (!['boulders', 'gyms', 'counters-collection'].includes(col)) {
      console.log(`  [added] collection="${col}" id="${msg.id}"`);
      console.log(`  fields:`, JSON.stringify(msg.fields, null, 2));
    }
  }

  if (msg.msg === 'ready') {
    if (targetBoulderId && subsToTest.length === 0) {
      // First ready = boulder list ready, now start testing
      startTesting(targetBoulderId);
    } else {
      const sub = subsToTest[subIndex - 1];
      if (sub) {
        console.log(`  ✅ READY: "${sub.name}" → collections received:`, Object.keys(collections).filter(c => !['boulders','gyms','counters-collection'].includes(c)));
      }
      trySub();
    }
  }

  if (msg.msg === 'nosub') {
    const sub = subsToTest[subIndex - 1];
    console.log(`  ❌ NOSUB: "${sub?.name}" — ${msg.error?.reason ?? 'no reason'}`);
    trySub();
  }
});

function startTesting(boulderId) {
  console.log(`\n🔍 Testing subs for boulder: ${boulderId}\n`);
  subsToTest = [
    { name: '_boulders.comments',   params: [boulderId] },
    { name: 'boulder.comments',     params: [boulderId] },
    { name: '_boulder.comments',    params: [boulderId] },
    { name: '_boulders.comment',    params: [boulderId] },
    { name: '_boulders.media',      params: [boulderId] },
    { name: 'boulder.media',        params: [boulderId] },
    { name: '_boulders.photos',     params: [boulderId] },
    { name: '_boulders.videos',     params: [boulderId] },
    { name: '_boulders.detail',     params: [boulderId] },
    { name: 'boulder.detail',       params: [boulderId] },
    { name: '_boulders.single',     params: [boulderId] },
    { name: '_boulders.info',       params: [boulderId] },
    { name: '_posts',               params: [{ boulderId }] },
    { name: 'posts',                params: [{ boulderId }] },
    { name: '_boulders.posts',      params: [boulderId] },
    { name: 'boulders.comments',    params: [boulderId] },
  ];
  trySub();
}

function trySub() {
  if (subIndex >= subsToTest.length) {
    console.log('\n--- All tested ---');
    console.log('All collections found:', Object.keys(collections));
    ws.close();
    process.exit(0);
    return;
  }
  const sub = subsToTest[subIndex++];
  console.log(`Testing: "${sub.name}" params=${JSON.stringify(sub.params)}`);
  send({ msg: 'sub', id: String(++msgId), name: sub.name, params: sub.params });
}

ws.on('error', (err) => { console.error('WS error:', err.message); process.exit(1); });
setTimeout(() => {
  console.log('\nTimeout — collections found:', Object.keys(collections));
  ws.close();
  process.exit(1);
}, 30000);
