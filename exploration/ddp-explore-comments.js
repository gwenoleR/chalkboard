// Find a boulder with comments and explore the _boulders.comments subscription
// Usage: node exploration/ddp-explore-comments.js

const WebSocket = require('ws');
const TOKEN = 'nLsGXHZeaKrRYU3mDkRj8V74AqS-Ce6ZfcW4D12svIp';
const USER_ID = '57gTQAqa9uh2eW6af';
const GYM = 'wattabloc';

const ws = new WebSocket('wss://www.sboulder.com/sockjs/websocket', {
  headers: { Origin: 'https://www.sboulder.com', 'User-Agent': 'Mozilla/5.0' },
});

let msgId = 0;
const collections = {};

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
    console.log('✅ Logged in — fetching boulders to find one with comments\n');
    send({
      msg: 'sub', id: String(++msgId), name: '_boulders.list',
      params: [{ gym: GYM, isClosed: null }, { createdAt: -1 }, 100, null],
    });
  }

  if (msg.msg === 'added') {
    const col = msg.collection;
    if (!collections[col]) collections[col] = {};
    collections[col][msg.id] = msg.fields;
  }

  if (msg.msg === 'ready') {
    const boulders = collections['boulders'] || {};
    // Find a boulder with comments
    const withComments = Object.entries(boulders)
      .filter(([, b]) => b.commentsCount > 0)
      .sort(([, a], [, b]) => b.commentsCount - a.commentsCount);

    if (withComments.length === 0) {
      console.log('No boulders with comments found. Also try closed ones...');
      // Try closed boulders
      send({
        msg: 'sub', id: String(++msgId), name: '_boulders.list',
        params: [{ gym: GYM }, { createdAt: -1 }, 50, null],
      });
      return;
    }

    const [topId, topFields] = withComments[0];
    console.log(`📍 Boulder with most comments: ${topId} (${topFields.grade}, ${topFields.commentsCount} comments, ${topFields.videosCount || 0} videos)\n`);
    console.log('Top 5 by comments:');
    withComments.slice(0, 5).forEach(([id, b]) => {
      console.log(`  ${id} ${b.grade} comments=${b.commentsCount} videos=${b.videosCount || 0}`);
    });

    console.log('\n--- Testing _boulders.comments ---');
    const newCollections = {};
    // Subscribe to comments
    const subId = String(++msgId);
    send({ msg: 'sub', id: subId, name: '_boulders.comments', params: [topId] });
  }

  if (msg.msg === 'added') {
    const col = msg.collection;
    if (!['boulders', 'gyms', 'counters-collection', 'kadira_settings', 'users'].includes(col)) {
      console.log(`\n[NEW COLLECTION] "${col}" id="${msg.id}"`);
      console.log(JSON.stringify(msg.fields, null, 2));
    }
  }
});

ws.on('error', (err) => { console.error('WS error:', err.message); process.exit(1); });
setTimeout(() => {
  console.log('\n--- Final collections ---');
  const all = Object.keys(collections);
  console.log(all);

  // Show non-standard ones
  const known = ['boulders', 'gyms', 'counters-collection', 'kadira_settings', 'users'];
  const newOnes = all.filter(c => !known.includes(c));
  if (newOnes.length) {
    newOnes.forEach(col => {
      console.log(`\n=== ${col} ===`);
      console.log(JSON.stringify(collections[col], null, 2));
    });
  }
  ws.close();
  process.exit(0);
}, 15000);
