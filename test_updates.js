import http from 'http';

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/artworks?limit=1',
  method: 'GET'
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log('GET /api/artworks Status:', res.statusCode);
    if (res.statusCode >= 400) {
      console.log('Error:', body);
    } else {
      console.log('Success, response length:', body.length);
      const data = JSON.parse(body);
      if (data.data && data.data.length > 0) {
        console.log('Sample Artwork ID:', data.data[0].id);
        console.log('OriginalCoverUrl:', data.data[0].originalCoverUrl);
        console.log('IsPending:', data.data[0].isPending);
      }
    }
  });
});

req.on('error', e => console.error('Request error:', e.message));
req.end();
