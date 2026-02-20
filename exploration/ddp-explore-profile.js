// Dump the current user's full profile via users.single subscription
// Usage: node exploration/ddp-explore-profile.js

const WebSocket = require('ws');
const TOKEN = 'nLsGXHZeaKrRYU3mDkRj8V74AqS-Ce6ZfcW4D12svIp';
const USER_ID = '57gTQAqa9uh2eW6af';

const ws = new WebSocket('wss://www.sboulder.com/sockjs/websocket', {
  headers: { Origin: 'https://www.sboulder.com', 'User-Agent': 'Mozilla/5.0' },
});

let msgId = 0;
const collections = {};

function send(obj) {
  ws.send(JSON.stringify([JSON.stringify(obj)]));
}

ws.on('open', () => {
  send({ msg: 'connect', version: '1', support: ['1'] });
});

ws.on('message', (raw) => {
  const str = raw.toString();
  if (str === 'o') return;
  if (str.startsWith('a')) {
    const messages = JSON.parse(str.slice(1));
    for (const m of messages) {
      const msg = JSON.parse(m);

      if (msg.msg === 'connected') {
        send({ msg: 'method', method: 'login', params: [{ resume: TOKEN }], id: String(++msgId) });
      }

      if (msg.msg === 'result' && msg.result?.id === USER_ID) {
        // Logged in — subscribe to own profile
        send({ msg: 'sub', id: String(++msgId), name: 'users.single', params: [USER_ID] });
      }

      if (msg.msg === 'added' || msg.msg === 'changed') {
        if (!collections[msg.collection]) collections[msg.collection] = {};
        if (collections[msg.collection][msg.id]) {
          Object.assign(collections[msg.collection][msg.id], msg.fields || {});
        } else {
          collections[msg.collection][msg.id] = { _id: msg.id, ...(msg.fields || {}) };
        }
      }
    }
  }
});

ws.on('error', (e) => console.error('WS error:', e.message));

setTimeout(() => {
  const user = collections['users']?.[USER_ID];
  if (!user) {
    console.log('No user data received');
    ws.close();
    return;
  }

  console.log('\n=== USER TOP-LEVEL FIELDS ===');
  console.log(Object.keys(user));

  console.log('\n=== profile.name ===');
  console.log(user.profile?.name);

  console.log('\n=== gyms ===');
  console.log(user.gyms);

  console.log('\n=== favoriteGyms ===');
  console.log(user.favoriteGyms);

  console.log('\n=== profile.scores keys ===');
  const scores = user.profile?.scores;
  if (scores) {
    console.log(Object.keys(scores));

    // Dump wattabloc score in full
    console.log('\n=== profile.scores.wattabloc (full) ===');
    console.log(JSON.stringify(scores['wattabloc'], null, 2));

    // Show structure of another gym for comparison
    const otherGym = Object.keys(scores).find(k => k !== 'wattabloc' && Object.keys(scores[k]).length > 0);
    if (otherGym) {
      console.log(`\n=== profile.scores.${otherGym} (full) ===`);
      console.log(JSON.stringify(scores[otherGym], null, 2));
    }
  }

  console.log('\n=== profile.avatars ===');
  console.log(JSON.stringify(user.profile?.avatars, null, 2));

  ws.close();
}, 4000);
