// Find boulders with videoId and explore format
const WebSocket = require('ws');
const TOKEN = 'nLsGXHZeaKrRYU3mDkRj8V74AqS-Ce6ZfcW4D12svIp';
const USER_ID = '57gTQAqa9uh2eW6af';

const ws = new WebSocket('wss://www.sboulder.com/sockjs/websocket', {
  headers: { Origin: 'https://www.sboulder.com', 'User-Agent': 'Mozilla/5.0' },
});

let msgId = 0;
const boulders = {};
const comments = {};

function send(msg) { ws.send(JSON.stringify(msg)); }

ws.on('open', () => send({ msg: 'connect', version: '1', support: ['1'] }));

ws.on('message', (raw) => {
  const msg = JSON.parse(raw);
  if (msg.msg === 'connected') {
    send({ msg: 'method', method: 'login', params: [{ resume: TOKEN }], id: String(++msgId) });
  }
  if (msg.msg === 'result' && msg.result?.id === USER_ID) {
    send({ msg: 'sub', id: String(++msgId), name: 'access-points', params: ['wattabloc'] });
  }
  if (msg.msg === 'added' && msg.collection === 'boulders') {
    boulders[msg.id] = msg.fields;
  }
  if (msg.msg === 'added' && msg.collection === 'comments') {
    comments[msg.id] = msg.fields;
  }
});

setTimeout(() => {
  // Find boulders with videoId
  const withVideo = Object.entries(boulders).filter(([, f]) => f.videoId);
  console.log('\n=== BOULDERS WITH videoId ===');
  withVideo.slice(0, 5).forEach(([id, f]) => {
    console.log({ id, videoId: f.videoId, videoSource: f.videoSource, videosCount: f.videosCount });
  });

  // Now subscribe to comments for a boulder with video to find comment videoId format
  const boulderWithVideo = withVideo[0];
  if (boulderWithVideo) {
    send({ msg: 'sub', id: String(++msgId), name: '_boulders.comments', params: [boulderWithVideo[0]] });
    setTimeout(() => {
      const videoComments = Object.entries(comments).filter(([, f]) => f.videoId);
      console.log('\n=== COMMENTS WITH videoId ===');
      videoComments.slice(0, 3).forEach(([id, f]) => {
        console.log({ id, videoId: f.videoId, videoSource: f.videoSource, text: f.text });
      });
      ws.close();
      process.exit(0);
    }, 3000);
  } else {
    console.log('No boulders with videoId found');
    ws.close();
    process.exit(0);
  }
}, 4000);
